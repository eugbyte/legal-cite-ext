import { browser, Menus } from "webextension-polyfill-ts";
import { ACTION } from "~/models/Action";

/**
 * Create the context menu option when user right clicks on the page
 * @param id context menu id
 * @param title text that appears in the context menu item
 * @param contexts the different contexts a menu item can appear in
 */
export const createContextMenu = (
  id: ACTION,
  title: string,
  contexts: Menus.ContextType[]
) => {
  browser.contextMenus.create({
    id,
    title,
    contexts,
  });
};

/**
 * Event listener to handle right click event
 * @param tabId the id of the current active tab
 * @param menuItemId the id of the context menu item clicked
 */
export const handleRightClick = (
  tabId: number,
  menuItemId: number | string
) => {
  switch (menuItemId) {
    case ACTION.SELECT:
      browser.tabs.sendMessage(tabId, ACTION.SELECT);
      break;
    case ACTION.PAGE:
      browser.tabs.sendMessage(tabId, ACTION.PAGE);
      break;
    default:
      break;
  }
};
