const numDot = /\d+\./;

function findLeftCursor(element: HTMLElement | null): HTMLElement | null {
  if (element == null) {
    return null;
  }

  const text: string = element?.innerText || "";
  if (numDot.test(text)) {
    return element;
  }
  return null;
}

/**
 * Find the left and right cursors from the range of text selected.
 * @returns left HTML element and right HTML element of the selected text
 */
export function findCursors(
  leftClickEvent: MouseEvent,
  rightClickEvent: MouseEvent
): [HTMLElement | null, HTMLElement | null] {
  // Sort the cursors.
  // Possible to select text in reverse direction, where right click is before left click.

  // rightClick is above left click on the Y axis
  if (rightClickEvent.pageY < leftClickEvent.pageY) {
    [leftClickEvent, rightClickEvent] = [rightClickEvent, leftClickEvent];
  }
  // rightClick is on same level as leftClick on the Y axis, but before leftClick on the X axis
  else if (
    leftClickEvent.pageY === rightClickEvent.pageY &&
    rightClickEvent.pageX < leftClickEvent.pageX
  ) {
    [leftClickEvent, rightClickEvent] = [rightClickEvent, leftClickEvent];
  }

  const leftCursor = leftClickEvent.target as HTMLElement | null;
  const rightCursor = rightClickEvent.target as HTMLElement | null;

  return [leftCursor, rightCursor];
}
