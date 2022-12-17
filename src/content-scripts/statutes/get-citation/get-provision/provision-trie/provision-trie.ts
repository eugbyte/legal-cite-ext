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
   * Searches for the Trie node matching the text
   * @param provision
   * @param current the current node during the recursion
   * @returns The Trie Node of the matching provison, or null if not found
   */
  getTrieNode(
    provision: string,
    current: ProvisionTrie = this
  ): ProvisionTrie | null {
    // base cases
    const { children } = current;
    if (current.end) {
      return null;
    }
    if (provision in children) {
      return children[provision];
    }

    for (const provision in children) {
      const res = this.getTrieNode(provision, children[provision]);
      if (res != null) {
        return res;
      }
    }

    return null;
  }

  /**
   * DFS through the graph to stringify all the children nodes, to form the provision text.
   * Bracketed alpahas, e.g. `"(a)"` are surrounded by i italic tags - `<i>(a)</i>`.
   *
   * E.g. `{ 6. -> (1) -> [(a), (b)] }` becomes s 6(1)(a)-(b).
   * @param shouldItalicise whether Bracketed alpahas e.g. `"(a)"` should be surrounded with `<i>` tags. Defaults to false.
   *
   * @returns The provison text
   */
  toString(shouldItalicise = false): string {
    const current: ProvisionTrie = this;

    let [leftResult, rightResult] = ["", ""];
    const left: string[] = this.toStringLeft(current).filter(
      (text) => text !== ""
    );
    const right: string[] = this.toStringRight(current).filter(
      (text) => text !== ""
    );

    // To italicse the sub provisions, e.g. `(a)`, which is the third index of ["7", "(1)", "(a)"]
    if (shouldItalicise && left.length >= 2) {
      left[2] = `<i>${left[2]}</i>`;
    }
    if (shouldItalicise && right.length >= 2) {
      right[2] = `<i>${right[2]}</i>`;
    }

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

  // the texts[] will have maximum of length 2, as for each left and right cursor target element, we collect only the first regex match
  private toStringLeft(current: ProvisionTrie = this): string[] {
    const { children } = current;
    const pairs: [string, ProvisionTrie][] = Object.entries(children);
    if (pairs.length === 0) {
      return [];
    }

    const [firstKey, firstValue] = pairs[0];
    return [firstKey, ...this.toStringLeft(firstValue)];
  }

  private toStringRight(current: ProvisionTrie = this): string[] {
    const { children } = current;
    const pairs: [string, ProvisionTrie][] = Object.entries(children);
    if (pairs.length === 0) {
      return [];
    }

    const [lastKey, lastValue] = pairs[pairs.length - 1];
    return [lastKey, ...this.toStringRight(lastValue)];
  }
}
