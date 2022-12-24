export enum ACTION {
  /**
   * User selects a range of text, and then right clicks
   */
  SELECT = "SELECT",
  /**
   * User simply right click w/o selecting a range of text
   */
  PAGE = "PAGE",
}

export class Action {
  constructor(public menuID: string, public message: string) {}
}
