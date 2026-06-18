"use client";

import { useEffect } from "react";

/** Javni ID iz GA -> Admin -> Data streams; env ga moze overrideati. */
const DEFAULT_MEASUREMENT_ID = "G-TSDCML52W1";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_MEASUREMENT_ID;

function ensureGtagStub() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function loadGoogleAnalytics() {
  if (typeof window === "undefined" || !GA_ID || window.__mparkGaLoaded) {
    return;
  }

  window.__mparkGaLoaded = true;
  ensureGtagStub();
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  script.dataset.source = "mpark-ga";
  document.head.appendChild(script);
}

/** Google Analytics 4: odgodjen do idle vremena ili prve interakcije. */
export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID) return undefined;

    ensureGtagStub();

    const triggerLoad = () => {
      loadGoogleAnalytics();
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", triggerLoad);
      window.removeEventListener("keydown", triggerLoad);
      window.removeEventListener("scroll", triggerLoad);
      window.removeEventListener("touchstart", triggerLoad);
    };

    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(triggerLoad, { timeout: 5000 })
        : window.setTimeout(triggerLoad, 5000);

    window.addEventListener("pointerdown", triggerLoad, { passive: true });
    window.addEventListener("keydown", triggerLoad, { passive: true });
    window.addEventListener("scroll", triggerLoad, { passive: true });
    window.addEventListener("touchstart", triggerLoad, { passive: true });

    return () => {
      removeListeners();
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  return null;
}
