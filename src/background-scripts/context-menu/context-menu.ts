import { browser, Menus } from "webextension-polyfill-ts";
import { MENU_CONTEXT_TYPE } from "~/models/Action";

/**
 * Create the context menu option when user right clicks on the page
 * @param id context menu id
 * @param title text that appears in the context menu item
 * @param contexts the different contexts a menu item can appear in
 */
export const createContextMenu = (
  id: MENU_CONTEXT_TYPE,
  title: string,
  contexts: Menus.ContextType[]
) => {
  browser.contextMenus.create({
    id,
    title,
    contexts,
    targetUrlPatterns: ["https://sso.agc.gov.sg/*"],
  });
};
