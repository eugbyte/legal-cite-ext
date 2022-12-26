import { browser } from "webextension-polyfill-ts";
import { Action, APP_ID, MENU_CONTEXT_TYPE } from "~/models/Action";
import { createParas, write } from "./clipboard";
import {
  getChapter,
  getRevEdYear,
  getProvision,
  ProvisionTrie,
} from "./get-citation";
import { sortCursors } from "./sort-cursors";

/**
 * User flow:
 * 1. User either right clicks, or selects text and then right clicks, triggerring context menu event in the content script
 * 2. Either selection context menu or page context menu (simple right click) is displayed
 * 2. User left clicks on a context menu item, trigger context menu event in the background script
 */

// IIFE to prevent variable pollution
(async () => {
  let leftCursor: MouseEvent | null = null;
  let rightCursor: MouseEvent | null = null;

  document.addEventListener("mousedown", (event) => {
    const LEFT_CLICK = 0;
    if (event.button === LEFT_CLICK) {
      leftCursor = event;
    }
  });

  document.addEventListener("contextmenu", (event) => {
    rightCursor = event;
  });

  /**
   * 1. Sort the left cursor and right cursor dependening on the user's action - user might select the text backwards, or simply right click w/o left clicking.
   * 2. Generate the citation based on the left click target element, right click target element.
   */
  browser.runtime.onMessage.addListener(async (action: Action) => {
    try {
      // User selects a range of text, and then right clicks
      const isTextSelect: boolean =
        action?.ID === APP_ID &&
        action?.message === MENU_CONTEXT_TYPE.SELECT &&
        leftCursor?.target != null &&
        rightCursor?.target != null;
      // User simply right click w/o selecting a range of text
      const isRightClick: boolean =
        action?.ID === APP_ID &&
        action?.message === MENU_CONTEXT_TYPE.PAGE &&
        rightCursor?.target != null;

      if (!(isTextSelect || isRightClick)) {
        return;
      }

      if (isTextSelect) {
        // When user selects text, there will be both a left click and right click.
        [leftCursor, rightCursor] = sortCursors(
          leftCursor as MouseEvent,
          rightCursor as MouseEvent
        );
      } else if (isRightClick) {
        // User simply right clicks w/o selecting text, so there will be no left click.
        // In this case, register the right cursor as the left cursor since `getProvision(leftCursor, rightCursor)` requires both cursors
        leftCursor = rightCursor;
      }

      const text: string = document.getSelection()?.toString() || "";
      const chapter: string = getChapter(); // Personal Data Protection Act 2012
      const revEdYear = getRevEdYear(); // 2020 Rev Ed
      const trie: ProvisionTrie = getProvision(
        (leftCursor as MouseEvent).target as HTMLElement,
        (rightCursor as MouseEvent).target as HTMLElement
      );
      console.log({ provision: trie.toString() }); // s 2(a)

      let textContent = `${text}\n`;
      textContent += `${chapter} (${revEdYear}) s ${trie.toString()}`;

      let htmlContent = `${createParas(text)}\n`;
      htmlContent += `${chapter} (${revEdYear}) s ${trie.toString({
        shouldItalicise: true,
      })}`;

      await write(htmlContent, textContent);
    } catch (error) {
      console.error(error);
    }
  });
})();
