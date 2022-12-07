import { createParas } from "./create-paras";

it("createParas() should create HTML paragraphs for each line break detected", () => {
  const selection =
    "on its own behalf or on behalf of the Government;\r\n(g)\tto administer and enforce this Act;\r\n(h)\tto carry out functions";
  const paras: string[] = createParas(selection);
  expect(paras.length).toBe(3);
  expect(
    paras.every((para) => para.includes("<p>") && para.includes("</p>"))
  ).toBeTruthy();
});
