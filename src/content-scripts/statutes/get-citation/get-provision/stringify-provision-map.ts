/**
 * A Trie representing the way the provisions are connected,
 * e.g. `2. -> (a) -> (i)`, forms "s 2(a)(i)".
 * Trie is preferred to graph, because trie is non-disjointed, and non-circular (e.g. s 5(i)(i)).
 *
 * Purpose of this class is to stringify the provision ordered maps.
 */
export class Trie {
  end = false;
  children: Record<string, Trie> = {};

  /**
   * Build the Trie, e.g. 6 -> a -> [(i),(ii)], so that we can do a dfs later to stringify the Trie.
   * @param provisionMap the ordered dict mapping the regex to the matches found, e.g. `{ /d+\./ : "6.", /\(-?\d+\)/ : "(1)" }`
   */
  add(provisionMap: Map<RegExp, string>): void {
    let current: Trie = this;
    for (const value of provisionMap.values()) {
      const { children } = current;
      if (!(value in children)) {
        children[value] = new Trie();
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
  search(provision: string, current: Trie = this): Trie | null {
    // base cases
    const { children } = current;
    if (current.end) {
      return null;
    }
    if (provision in children) {
      return children[provision];
    }

    for (const provision in children) {
      const res = this.search(provision, children[provision]);
      if (res != null) {
        return res;
      }
    }

    return null;
  }

  /**
   * DFS through the graph to stringify all the children nodes, to form the provision text.
   *
   * E.g. `{ 6. -> (1) -> [(a), (b)] }` becomes s 6(1)(a)-(b).
   * @param current the current node during the recursion
   * @returns
   */
  toString(current: Trie = this): string {
    const { children } = current;

    const texts: string[] = [];
    for (const provision in children) {
      const text = provision + this.toString(children[provision]);
      texts.push(text);
    }

    // the texts[] will have maximum of length 2, as for each left and right cursor target element, we collect only the first regex match
    return texts.join("-");
  }
}
