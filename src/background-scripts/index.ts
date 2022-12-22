import { createContextMenu } from "./context-menu";
import { getActiveTabID } from "./tabs";
import { browser } from "webextension-polyfill-ts";
import { handleRightClick } from "./context-menu/context-menu";

// In manifest v3, extensions must register listeners in the first turn of the event loop. (https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/#event_listeners)
// Service workers are non-persistent. Chrome terminates service workers that has been idle for 30 seconds.
// If listener functions is instead enqueued in the message queue,
// there is a chance that the service worker is terminated before the message can be dequeued.
// Each message has an associated function that gets called to handle the message, most likely by reference.
browser.contextMenus.onClicked.addListener(async (info) => {
  const tabId: number = await getActiveTabID();
  handleRightClick(info.menuItemId, tabId);
});

createContextMenu();
