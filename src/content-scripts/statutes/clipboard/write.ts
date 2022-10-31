/**
 *
 * @param htmlContent 'text/html' content
 * @param textContent  fallback 'text/plain' content
 */
export const write = async (htmlContent: string, textContent: string) => {
  // ClipboardItem is not supported in firefox
  // execCommand is not supported in chrome
  if ("ClipboardItem" in window) {
    const item = new ClipboardItem({
      "text/plain": new Blob([textContent], { type: "text/plain" }),
      "text/html": new Blob([htmlContent], { type: "text/html" }),
    });
    await navigator.clipboard.write([item]);
  } else {
    // copy(htmlContent, {
    //   format: 'text/html',
    // });
    // copy(textContent, {
    //   format: 'text/plain',
    // });

    document.addEventListener("copy", (event: ClipboardEvent) => {
      (event.clipboardData as DataTransfer).setData("text/html", htmlContent);
      (event.clipboardData as DataTransfer).setData("text/plain", textContent);
      event.preventDefault();
    });

    document.execCommand("copy");
  }
};
