import {
  bracketAlpha,
  bracketNumber,
  getProvisionMap,
  numDot,
  roman,
} from "./get-provision-map";

describe("test getProvisionMap", () => {
  it("getProvisionMap should return provision of s 8(2)(a)", () => {
    const element1 = document.createElement("div");
    element1.innerText = "(a)";

    const element2 = document.createElement("div");
    element2.innerText = "(1)";

    const element3 = document.createElement("div");
    element3.innerText = "(2)";

    const element4 = document.createElement("div");
    element4.innerText = "8.";

    element4.appendChild(element3);
    element4.appendChild(element2);
    element3.appendChild(element1);

    const orderedMap = new Map<RegExp, string>([
      [numDot, "8."],
      [bracketNumber, "(2)"],
      [bracketAlpha, "(a)"],
    ]);

    const actual = getProvisionMap(element1);
    expect(actual).toMatchObject(orderedMap);
  });

  it("getProvisionMap should handle roman numeral, e.g. '(i)'", () => {
    const element1 = document.createElement("div");
    element1.innerText = "(i)";

    const table = document.createElement("table");

    const element2 = document.createElement("div");
    element2.innerText = "(a)";

    const element3 = document.createElement("div");
    element3.innerText = "(2)";

    const element4 = document.createElement("div");
    element4.innerText = "8.";

    element4.appendChild(element3);
    element3.appendChild(element2);
    element2.appendChild(table);
    table.appendChild(element1);

    const orderedMap = new Map<RegExp, string>([
      [numDot, "8."],
      [bracketNumber, "(2)"],
      [bracketAlpha, "(__)"],
      [roman, "(i)"],
    ]);

    const actual = getProvisionMap(element1);
    expect(actual).toMatchObject(orderedMap);
  });

  it("getProvisionMap should handle overlapping regex matches between alpha and roman numeral, e.g. '(i)'", () => {
    // testing s 8(2)(i)
    const element1 = document.createElement("div");
    element1.innerText = "(i)";

    const table = document.createElement("table");

    const element2 = document.createElement("div");
    element2.innerText = "(2)";

    const element3 = document.createElement("div");
    element3.innerText = "8.";

    element3.appendChild(element2);
    element2.appendChild(table);
    table.appendChild(element1);

    const orderedMap = new Map<RegExp, string>([
      [numDot, "8."],
      [bracketNumber, "(2)"],
      [bracketAlpha, "(__)"],
      [roman, "(i)"],
    ]);

    const actual = getProvisionMap(element1);
    console.log(actual);
    expect(actual).toMatchObject(orderedMap);
  });
});
