import { browser } from "webextension-polyfill-ts";
import { Action } from "~/models/Action";
import { write } from "./clipboard";
import { getCitation } from "./get-citation";
import { sortCursors } from "./get-citation/sort-cursors";

enum CLICK_TYPE {
  left = 0,
  middle,
  right,
}

/**
 * User flow:
 * 1. User right clicks, triggerring context menu event in the content script
 * 2. Context menu is displayed
 * 2. User left clicks on a context menu item, trigger context menu event in the background script
 */

// IIFE
(async () => {
  console.log("in content script");

  let leftCursor: MouseEvent | null = null;
  let rightCursor: MouseEvent | null = null;

  document.addEventListener("mousedown", (event) => {
    if (event.button !== CLICK_TYPE.left) {
      return;
    }
    leftCursor = event;

    // event.stopPropagation();
    console.log(event.button);
    console.log(event.target);
    // console.log(event.button);
    console.log({
      leftCursorText: (leftCursor.target as HTMLElement).textContent,
    });
  });

  document.addEventListener("contextmenu", (event) => {
    rightCursor = event;
  });

  browser.runtime.onMessage.addListener(async (action: Action) => {
    if (
      leftCursor?.target != null &&
      rightCursor?.target != null &&
      action.id === "legal-cite-ext" &&
      action.type === "right-click"
    ) {
      try {
        [leftCursor, rightCursor] = sortCursors(leftCursor, rightCursor);
        const citation = getCitation(
          leftCursor.target as HTMLElement,
          rightCursor.target as HTMLElement
        );
        const text: string = document.getSelection()?.toString() || "";
        const htmlContent = `
          <p>${text}</p>
          <p style="color:red">${citation}</p>
        `;
        await write(htmlContent, `${text}\n${citation}`);
      } catch (error) {
        console.log(error);
      }
    }
  });
})();
