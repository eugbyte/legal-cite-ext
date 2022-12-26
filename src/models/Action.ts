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
  constructor(public ID: string, public message: string) {}
}

export const APP_ID = "legal-cite-ext";
