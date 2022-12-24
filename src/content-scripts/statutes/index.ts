import { browser } from "webextension-polyfill-ts";
import { Action, ACTION } from "~/models/Action";
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
 * 1. User right clicks, triggerring context menu event in the content script
 * 2. Context menu is displayed
 * 2. User left clicks on a context menu item, trigger context menu event in the background script
 */

// IIFE
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

  browser.runtime.onMessage.addListener(async (action: Action) => {
    try {
      // User selects a range of text, and then right clicks
      const isTextSelect: boolean =
        leftCursor?.target != null &&
        rightCursor?.target != null &&
        action.menuID == "legal-cite-ext" &&
        action.message === ACTION.SELECT;
      // User simply right click w/o selecting a range of text
      const isRightClick: boolean =
        rightCursor?.target != null &&
        action.menuID == "legal-cite-ext" &&
        action.message === ACTION.PAGE;

      if (!(isTextSelect || isRightClick)) {
        return;
      }

      if (isTextSelect) {
        [leftCursor, rightCursor] = sortCursors(
          leftCursor as MouseEvent,
          rightCursor as MouseEvent
        );
      } else if (isRightClick) {
        leftCursor = rightCursor;
      }

      const text: string = document.getSelection()?.toString() || "";
      const chapter: string = getChapter(); // Personal Data Protection Act 2012
      const revEdYear = getRevEdYear(); // 2020 Rev Ed
      const trie: ProvisionTrie = getProvision(
        (leftCursor as MouseEvent).target as HTMLElement,
        (rightCursor as MouseEvent).target as HTMLElement
      );
      console.log({ provision: trie.toString() });

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
