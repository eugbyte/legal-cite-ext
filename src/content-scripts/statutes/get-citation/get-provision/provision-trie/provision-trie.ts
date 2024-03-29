export interface Options {
  shouldItalicise: boolean;
}

/**
 * A Trie representing the way the provisions are connected,
 * e.g. `2. -> (a) -> (i)`, forms "s 2(a)(i)".
 * Trie is preferred to graph, because trie is non-disjointed, and non-circular (e.g. s 5(i)(i)).
 *
 * Purpose of this class is to stringify the provision ordered maps.
 */
export class ProvisionTrie {
  end = false;
  children: Record<string, ProvisionTrie> = {};

  /**
   * Build the Trie, e.g. 6 -> a -> [(i),(ii)], so that we can do a dfs later to stringify the Trie.
   * @param provisionMap the ordered dict mapping the regex to the matches found, e.g. `{ /d+\./ : "6.", /\(-?\d+\)/ : "(1)" }`
   */
  add(provisionMap: Map<RegExp, string>): void {
    let current: ProvisionTrie = this;
    for (const value of provisionMap.values()) {
      const { children } = current;
      if (!(value in children)) {
        children[value] = new ProvisionTrie();
      }
      current = children[value];
    }
    current.end = true;
  }

  /**
   * DFS through the graph to stringify all the children nodes, to form the provision text.
   * Bracketed alpahas, e.g. `"(a)"` are surrounded by i italic tags - `<i>(a)</i>`.
   *
   * E.g. `{ 6. -> (1) -> [(a), (b)] }` becomes s 6(1)(a)-(b).
   * @param options whether Bracketed alpahas e.g. `"(a)"` should be surrounded with `<i>` tags. Defaults to false.
   *
   * @returns The provison text
   */
  toString(options: Options = { shouldItalicise: false }): string {
    const current: ProvisionTrie = this;

    const left: string[] = this.leftView(current).filter((text) => text !== "");
    const right: string[] = this.rightView(current).filter(
      (text) => text !== ""
    );

    // To italicse the sub provisions, e.g. `(a)`, which is index 2 of ["7", "(1)", "(a)"]
    const { shouldItalicise } = options;
    const italIndex = 2;
    if (shouldItalicise && left.length >= italIndex + 1) {
      left[italIndex] = this.italiciseProvision(left[italIndex]);
    }
    if (shouldItalicise && right.length >= italIndex + 1) {
      right[italIndex] = this.italiciseProvision(right[italIndex]);
    }
    return this.combineViews(left, right);
  }

  /**
   * Provide the left side view of the trie - the left most nodes for every level.
   * @param current The current trie in the recursive call
   * @returns an array of provisions
   */
  private leftView(current: ProvisionTrie = this): string[] {
    const { children } = current;
    const pairs: [string, ProvisionTrie][] = Object.entries(children);
    if (pairs.length === 0) {
      return [];
    }

    const [firstKey, firstValue] = pairs[0];
    return [firstKey, ...this.leftView(firstValue)];
  }

  /**
   * Provide the right side view of the trie - the right most nodes for every level.
   * @param current The current trie in the recursive call
   * @returns an array of provisions
   */
  private rightView(current: ProvisionTrie = this): string[] {
    const { children } = current;
    const pairs: [string, ProvisionTrie][] = Object.entries(children);
    if (pairs.length === 0) {
      return [];
    }

    const [lastKey, lastValue] = pairs[pairs.length - 1];
    return [lastKey, ...this.rightView(lastValue)];
  }

  /**
   * Concatenate the left side view and right side view
   * @param left the left side view - the left most nodes for every level.
   * @param right the right side view - the right most nodes for every level.
   * @returns a string combining both views
   */
  private combineViews(left: string[], right: string[]): string {
    let [leftResult, rightResult] = ["", ""];

    // Ignore the common parent in the trie, instead preferring the leftResult if such common parent if found
    const len = Math.min(left.length, right.length);
    let i = 0;
    while (i < len) {
      leftResult += left[i];
      if (left[i] != right[i]) {
        rightResult += right[i];
        i += 1;
        break;
      }
      i += 1;
    }

    if (i < left.length) {
      leftResult += left.slice(i).join("");
    }
    if (i < right.length) {
      rightResult += right.slice(i).join("");
    }
    return [leftResult, rightResult]
      .filter((text) => text !== "")
      .join("-")
      .replace(/\n+/g, "");
  }

  /**
   * Surround the provision with <i> tags, e.g. `"(a)" -> "(<i>a</i>a)"`
   * @param provision
   * @returns the transformed string with <i></i> tags within, e.g. "s 2(<i>e</i>)""
   */
  italiciseProvision(provision: string): string {
    provision = provision.replace("(", "").replace(")", "");
    return `(<i>${provision}</i>)`;
  }
}
