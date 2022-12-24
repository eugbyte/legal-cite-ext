import { createContextMenu } from "./context-menu";
import { getActiveTabID } from "./tabs";
import { browser, Menus } from "webextension-polyfill-ts";
import { MENU_CONTEXT_TYPE, Action, APP_ID } from "~/models/Action";

// In manifest v3, extensions must register listeners in the first turn of the event loop. (https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#event_listeners)
// Service workers are non-persistent. Chrome terminates service workers that has been idle for 30 seconds.
// If listener functions is instead enqueued in the message queue,
// there is a chance that the service worker is terminated before the message can be dequeued.
// Each message has an associated function that gets called to handle the message, most likely by reference.

// Event listener to handle right click event
browser.contextMenus.onClicked.addListener(async (info: Menus.OnClickData) => {
  const tabId: number = await getActiveTabID();
  const { menuItemId } = info;

  switch (menuItemId) {
    case MENU_CONTEXT_TYPE.SELECT:
      browser.tabs.sendMessage(
        tabId,
        new Action(APP_ID, MENU_CONTEXT_TYPE.SELECT)
      );
      break;
    case MENU_CONTEXT_TYPE.PAGE:
      browser.tabs.sendMessage(
        tabId,
        new Action(APP_ID, MENU_CONTEXT_TYPE.PAGE)
      );
      break;
    default:
      break;
  }
});

// Applies when part of the page is selected, e.g. user selects a range of text and then right clicks.
createContextMenu(MENU_CONTEXT_TYPE.SELECT, "Copy with citation", [
  "selection",
]);
// Applies when the user simply right clicks on the page
createContextMenu(MENU_CONTEXT_TYPE.PAGE, "Copy citation", ["page"]);
