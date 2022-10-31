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
  const target: [HTMLElement | null] = [null];

  document.addEventListener("contextmenu", (event) => {
    target[0] = event.target as HTMLElement;
  });

  browser.runtime.onMessage.addListener(async (action: Action) => {
    if (
      target[0] != null &&
      action.id === "legal-cite-ext" &&
      action.type === "right-click"
    ) {
      try {
        const citation = getCitation(target[0]);
        const text: string = document.getSelection()?.toString() || "";
        const htmlContent = `
          <p>${text}</p>
          <span style="color:red">${citation}
        `;
        await write(htmlContent, `${text}\n${citation}`);
      } catch (error) {
        console.log(error);
      }
    }
  });
})();
