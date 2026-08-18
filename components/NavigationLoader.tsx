"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Listen to path changes to complete navigation loading
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
        setVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Handle progress bar animation increments
  useEffect(() => {
    if (!isNavigating) return;

    setVisible(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Hold at 90%
        // Standard ease-out progress step
        const diff = 100 - prev;
        const step = Math.max(1, Math.floor(diff * 0.15));
        return Math.min(90, prev + step);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isNavigating]);

  // Listen to clicks on links for starting navigation loader
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      // Only handle left clicks without modifier keys
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      // Ignore external or specialized link attributes
      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr.includes("_blank")) return;
      if (anchor.hasAttribute("download")) return;

      const rel = anchor.getAttribute("rel");
      if (rel && rel.includes("external")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore mailto, tel, javascript links
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Verify destination is internal and path is actually changing
        const isInternal = url.origin === window.location.origin;
        if (!isInternal) return;

        const isSamePathname = url.pathname === currentUrl.pathname;
        const isSameSearch = url.search === currentUrl.search;
        const isHashChange = url.hash !== currentUrl.hash;

        // Skip if navigating to same page/search or just a hash change
        if ((isSamePathname && isSameSearch) || isHashChange) {
          return;
        }

        // Start navigation loader
        setIsNavigating(true);
      } catch (err) {
        // Safe fallback if URL parsing fails
      }
    };

    // Listen to browser back/forward buttons (popstate)
    const handlePopState = () => {
      setIsNavigating(true);
    };

    document.addEventListener("click", handleLinkClick);
    window.addEventListener("popstate", handlePopState);

    // Fallback: intercept history changes to stop loader in case something completes instantly
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      setTimeout(() => {
        setIsNavigating(false);
      }, 0);
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      setTimeout(() => {
        setIsNavigating(false);
      }, 0);
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-brass transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: progress > 0 && progress < 100 ? 1 : 0,
        boxShadow: "0 0 8px #d4a53e, 0 0 4px #f0cc7c",
      }}
    />
  );
}
