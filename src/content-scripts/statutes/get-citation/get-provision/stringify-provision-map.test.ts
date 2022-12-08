import { numDot, bracketNumber, bracketAlpha } from "./get-provision-map";
import { ProvisionTrie } from "./stringify-provision-map";

describe("test ProvisionGraph", () => {
  it("ProvisionGraph should return provision of s 8(2)(a)", () => {
    const orderedMap = new Map<RegExp, string>([
      [numDot, "8."],
      [bracketNumber, "(2)"],
      [bracketAlpha, "(a)"],
    ]);

    const trie = new ProvisionTrie();
    trie.add(orderedMap);
    const text = trie.toString();
    expect(text).toBe("s 8(2)(a)");
  });
});
