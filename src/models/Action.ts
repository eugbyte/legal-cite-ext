export enum MENU_CONTEXT_TYPE {
  /**
   * User selects a range of text, and then right clicks
   */
  SELECT = "selection",
  /**
   * User simply right click w/o selecting a range of text
   */
  PAGE = "page",
}

export class Action {
  constructor(public menuID: string, public message: MENU_CONTEXT_TYPE) {}
}

export const APP_ID = "legal-cite-ext";
