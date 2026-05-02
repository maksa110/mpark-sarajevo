"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal primitive.
 *
 * SEO/A11y safety:
 *  - Children are server-rendered into the DOM as usual; we only toggle CSS
 *    classes (opacity/transform) — never `display: none`.
 *  - A `<noscript>` style override in the root layout makes the content
 *    fully visible when JS is disabled, so crawlers/AT see everything.
 *  - `prefers-reduced-motion` is respected (we skip animation entirely).
 *
 * Performance:
 *  - One IntersectionObserver per instance; disconnects after first reveal.
 *  - GPU-only properties: opacity + transform → CLS = 0.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Ako IO ne pali (viewport/headless timing), svejedno prikaži sadržaj — GSC screenshot.
    const failSafe = window.setTimeout(() => {
      setShown(true);
    }, 750);
    return () => clearTimeout(failSafe);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cls = `reveal${shown ? " reveal-on" : ""}${className ? ` ${className}` : ""}`;
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag ref={ref} className={cls} style={style} {...rest}>
      {children}
    </Tag>
  );
}
