import { browser } from "webextension-polyfill-ts";
import { Action } from "~/models/Action";

export const options = {
  id: "legal-cite-ext",
  title: "Copy with source",
};

/**
 * Create the context menu option when user right clicks on the page
 */
export const createContextMenu = () => {
  browser.contextMenus.create({
    id: options.id,
    title: options.title,
    contexts: ["selection"],
  });
};

/**
 * Event listener to handle right click event
 * @param menuItemId the id of the context menu item clicked
 * @param tabId the id of the current active tab
 */
export const handleRightClick = (
  menuItemId: number | string,
  tabId: number
) => {
  switch (menuItemId) {
    case options.id:
      console.log("right clicked");
      browser.tabs.sendMessage(
        tabId,
        new Action(options.id, "copy-with-source")
      );
      break;
    default:
      break;
  }
};
