import { browser } from "webextension-polyfill-ts";
import { Action } from "~/models/Action";
import { write } from "./clipboard";
import { formatHTML } from "./format-html";
import { getCitation } from "./get-citation";
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
        const citation: string = getCitation(
          leftCursor.target as HTMLElement,
          rightCursor.target as HTMLElement
        );

        const text: string = document.getSelection()?.toString() || "";
        const htmlContent = formatHTML(text, citation);

        await write(htmlContent, `${text}\n${citation}`);
      } catch (error) {
        console.log(error);
      }
    }
  });
})();
