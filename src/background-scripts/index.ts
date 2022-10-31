import { createContextMenu } from "./context-menu";
import { getActiveTabID } from "./tabs";

// IIFE
(async () => {
  const tabID = await getActiveTabID();
  createContextMenu(tabID);
})();
