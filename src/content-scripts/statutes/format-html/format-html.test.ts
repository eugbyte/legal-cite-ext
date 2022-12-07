import { formatHTML } from "./format-html";

describe(" test formatHTML", () => {
  it("formatHTML should italicise (a) in the citation text", () => {
    const selection =
      "Government on all matters relating to data protection; (d) to represent the Government c";
    const citation = "s 6(d)-(f)";
    const received = formatHTML(selection, citation);
    expect(received).toMatchInlineSnapshot(`
      "<div><p>Government on all matters relating to data protection; (d) to represent the Government c</p></div>
              <p style="color:red">s 6(<i>d</i>)-(<i>f</i>)</p>"
    `);
  });
});
