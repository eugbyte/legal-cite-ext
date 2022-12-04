import { browser } from "webextension-polyfill-ts";
import { Action } from "~/models/Action";

export const createContextMenu = (tabId: number) => {
  const options = {
    id: "legal-cite-ext",
    title: "Copy with source",
  };

  browser.contextMenus.create({
    id: options.id,
    title: options.title,
    contexts: ["selection"],
  });

  browser.contextMenus.onClicked.addListener((info) => {
    switch (info.menuItemId) {
      case options.id:
        browser.tabs.sendMessage(
          tabId,
          new Action(options.id, "right-click")
        );
        break;
      default:
        break;
    }
  });
};
