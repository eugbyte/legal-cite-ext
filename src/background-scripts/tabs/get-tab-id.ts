import { browser, Tabs } from "webextension-polyfill-ts";

export const getActiveTabID = async (): Promise<number> => {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });
  const tab: Tabs.Tab = tabs[0];
  const tabId = tab.id as number;
  return tabId;
};
