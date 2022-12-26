import { browser, Menus } from "webextension-polyfill-ts";
import { MENU_CONTEXT_TYPE } from "~/models/Action";

/**
 * @param id context menu id
 * @param title text that appears in the context menu item
 * @param contexts the different contexts a menu item can appear in
 * @param documentUrlPatterns lets you restrict the item to apply only to documents whose URL matches one of the given [patterns](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns)
 */
interface Props {
  id: MENU_CONTEXT_TYPE;
  title: string;
  contexts: Menus.ContextType[];
  documentUrlPatterns?: string[];
}

/**
 * Create the context menu option when user right clicks on the page
 */
export const createContextMenu = ({
  id,
  title,
  contexts,
  documentUrlPatterns,
}: Props) => {
  browser.contextMenus.create({
    id,
    title,
    contexts,
    documentUrlPatterns,
  });
};
