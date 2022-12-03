/**
 * Find the left and right cursors from the range of text selected.
 *
 * It is possible that the user selects the text backwards,
 * i.e. dragging the cursor left when selecting the text/
 * @returns left HTML element and right HTML element of the selected text
 */
export function sortCursors(
  leftClickEvent: MouseEvent,
  rightClickEvent: MouseEvent
): [MouseEvent, MouseEvent] {
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

  return [leftClickEvent, rightClickEvent];
}
