import { browser } from "webextension-polyfill-ts";
import { Action } from "~/models/Action";
import { write } from "./clipboard";
import { getCitation } from "./get-citation";

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

  document.addEventListener("click", (event) => {
    leftCursor = event;
  });

  document.addEventListener("contextmenu", (event) => {
    rightCursor = event;
  });

  browser.runtime.onMessage.addListener(async (action: Action) => {
    const hasRange = leftCursor?.target != null && rightCursor?.target != null;
    if (
      hasRange &&
      action.id === "legal-cite-ext" &&
      action.type === "right-click"
    ) {
      try {
        const citation = getCitation(rightCursor!.target as HTMLElement);
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
