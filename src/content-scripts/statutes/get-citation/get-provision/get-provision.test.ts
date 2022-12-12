import { getProvision } from "./get-provision";

describe("test getProvision", () => {
  it("getProvision should return s 6(d)-(f) when the user left clicks on s 6(d) and right clicks on s 6(f)", () => {
    const element1 = document.createElement("div");
    element1.innerText = "(d)";

    const element2 = document.createElement("div");
    element2.innerText = "(f)";

    const element3 = document.createElement("div");
    element3.innerText = "6.";

    element3.appendChild(element1);
    element3.appendChild(element2);

    const provision: string = getProvision(element1, element2);
    expect(provision).toBe("6(d)-(f)");
  });
});
