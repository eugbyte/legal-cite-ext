import { getChapter } from "./get-chapter";

it("getChapter should return the chapter of the Act", () => {
  const element = document.createElement("div");
  element.className = "legis-title";
  element.innerText = "Personal Data Protection Act 2012";
  document.body.appendChild(element);

  const chapter = getChapter();
  expect(chapter).toBe("Personal Data Protection Act 2012");
});
