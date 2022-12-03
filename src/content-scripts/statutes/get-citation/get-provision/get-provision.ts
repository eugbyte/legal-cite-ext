import { getProvisionMap } from "./get-provision-map";

export const getProvision = (
  leftClick: HTMLElement,
  rightClick: HTMLElement
) => {
  // merge the hashmaps from the left and right clicks
  // the hashmaps maps the regex to whatever is detected in the range of text selected
  // e.g.  /\d+\./ -> "2."
  const leftMap: Map<RegExp, string> = getProvisionMap(leftClick);
  const rightMap: Map<RegExp, string> = getProvisionMap(rightClick);
  const map = new Map<RegExp, Set<string>>();

  for (const [key, value] of [...leftMap.entries(), ...rightMap.entries()]) {
    if (!map.has(key)) {
      map.set(key, new Set<string>());
    }
    map.get(key)?.add(value);
  }

  let provisionText = "";
  for (const set of map.values()) {
    provisionText += [...set].filter((val) => val.trim() !== "").join("-");
  }
  provisionText = provisionText.replaceAll(".", "");
  console.log({ provisionText });
  return provisionText.replace(".", "");
};
