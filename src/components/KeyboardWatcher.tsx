"use client";

import { useEffect } from "react";

// iOS doesn't shrink the page when the keyboard opens, so fixed overlays and
// the bottom nav end up under (or floating above) the keyboard. This tracks
// the *visible* viewport and exposes it to CSS:
//   --app-height  visible height (shrinks while the keyboard is open)
//   --vv-top      how far iOS has scrolled the page to reveal the input
//   html[data-keyboard="open"] while a text field has focus with the keyboard up
export default function KeyboardWatcher() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;

    function update() {
      const height = vv ? vv.height : window.innerHeight;
      const top = vv ? vv.offsetTop : 0;
      root.style.setProperty("--app-height", `${height}px`);
      root.style.setProperty("--vv-top", `${top}px`);
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
        && !["checkbox", "radio", "file", "button", "submit"].includes((el as HTMLInputElement).type);
      const keyboardUp = typing && window.innerHeight - height > 120;
      if (keyboardUp || (typing && !vv)) root.dataset.keyboard = "open";
      else delete root.dataset.keyboard;
    }

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    // Give iOS a moment to animate the keyboard away before re-measuring.
    const onFocusOut = () => setTimeout(update, 50);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return null;
}
