import { browser } from "webextension-polyfill-ts";
import { Action } from "~/models/Action";
import { write } from "./clipboard";
import { createParas } from "./format-html";
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
    if (
      leftCursor?.target != null &&
      rightCursor?.target != null &&
      action.id === "legal-cite-ext" &&
      action.type === "copy-with-source"
    ) {
      try {
        [leftCursor, rightCursor] = sortCursors(leftCursor, rightCursor);

        const text: string = document.getSelection()?.toString() || "";
        const chapter: string = getChapter(); // Personal Data Protection Act 2012
        const revEdYear = getRevEdYear(); // 2020 Rev Ed
        const trie: ProvisionTrie = getProvision(
          leftCursor.target as HTMLElement,
          rightCursor.target as HTMLElement
        );
        console.log({provision: trie.toString()});

        let textContent = `${text}\n`;
        textContent += `{${chapter} (${revEdYear}) s ${trie.toString()}`;

        let htmlContent = `${createParas(text)}\n`;
        htmlContent += `{${chapter} (${revEdYear}) s ${trie.toString(
          true
        )}`;

        await write(htmlContent, textContent);
      } catch (error) {
        console.error(error);
      }
    }
  });
})();
