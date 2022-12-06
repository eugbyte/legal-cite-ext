import { getRevEdYear } from "./get-rev-year";

describe("test getting revised edition year", () => {
  it("getRevYear should return 4 digits", () => {
    const element = document.createElement("div");
    element.className = "status-value";
    element.innerText = "Current version  as at 06 Dec 2022";
    document.body.appendChild(element);

    const revEdYear = getRevEdYear();
    expect(revEdYear).toBe("2022 Rev Ed");
  });
});
