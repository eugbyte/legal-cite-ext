import { numDot, bracketNumber, bracketAlpha } from "../provision-map";
import { ProvisionTrie } from "./provision-trie";

const orderedMap = new Map<RegExp, string>([
  [numDot, "8."],
  [bracketNumber, "(2)"],
  [bracketAlpha, "(a)"],
]);

describe("test ProvisionGraph", () => {
  it("toString() should return provision of s 8(2)(a)", () => {
    const trie = new ProvisionTrie();
    trie.add(orderedMap);
    const text = trie.toString();
    expect(text).toBe("8.(2)(a)");
  });

  it("toString() with shouldItalicise set to return should return provision of s 8(2)(<i>a</i>)", () => {
    const trie = new ProvisionTrie();
    trie.add(orderedMap);
    const text = trie.toString({ shouldItalicise: true });
    expect(text).toBe("8.(2)(<i>a</i>)");
  });

  it("test italiciseProvision", () => {
    const trie = new ProvisionTrie();
    trie.add(orderedMap);

    const italics = trie.italiciseProvision("(a)");
    expect(italics).toBe("(<i>a</i>)");
  });
});
