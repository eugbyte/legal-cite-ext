import { italiciseRegexMatches } from "./italicise-regex";

it("italiciseRegexMatches should italicse regex matches", () => {
  const citation = "s 2(1)(a)";
  const bracketAlpha = /\([A-Z]+\)/gi;
  expect(italiciseRegexMatches(citation, bracketAlpha)).toBe(
    "s 2(1)(<i>a</i>)"
  );
});
