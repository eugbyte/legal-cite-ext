export class Action {
  /**
   *
   * @param id webextension id
   * @param type action type
   * @param msg message
   */
  constructor(public id: string, public type: string, public msg = "") {}
}
