import { numDot, bracketNumber, bracketAlpha } from "./get-provision-map";
import { ProvisionGraph } from "./stringify-provision-map";

describe("test ProvisionGraph", () => {
  it("ProvisionGraph should return provision of s 8(2)(a)", () => {
    const orderedMap = new Map<RegExp, string>([
      [numDot, "8."],
      [bracketNumber, "(2)"],
      [bracketAlpha, "(a)"],
    ]);

    const provisionGraph = new ProvisionGraph();
    provisionGraph.buildGraph(orderedMap);

    const ans: Record<string, Set<string>> = {
      root: new Set<string>(["8."]),
      "8.": new Set<string>(["(2)"]),
      "(2)": new Set<string>(["(a)"]),
      "(a)": new Set<string>(),
    };
    expect(provisionGraph.graphCopy).toMatchObject(ans);

    const text = provisionGraph.toString();
    expect(text).toBe("s 8(2)(a)");
  });
});
