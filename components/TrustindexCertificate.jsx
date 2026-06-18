"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

const TRUSTINDEX_CERT_SRC =
  "https://cdn.trustindex.io/loader-cert.js?dcb8297740bc422ba7066145817";

function hasTrustindexWidget() {
  if (typeof document === "undefined") return false;

  return Boolean(
    document.querySelector(
      [
        'script[src*="loader-cert.js"]',
        'iframe[src*="trustindex"]',
        '[class*="trustindex"]',
        '[id*="trustindex"]',
      ].join(",")
    )
  );
}

export default function TrustindexCertificate() {
  const [widgetReady, setWidgetReady] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (hasTrustindexWidget()) {
      setWidgetReady(true);
    }
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let idleId = null;
    let timeoutId = null;
    let observer = null;
    let reviewObserver = null;
    let cleanupInteraction = null;
    let cleanupScroll = null;
    let hasScheduledLoad = false;

    const markReadyIfInjected = () => {
      if (!cancelled && hasTrustindexWidget()) {
        setWidgetReady(true);
        return true;
      }
      return false;
    };

    const injectScript = () => {
      if (cancelled || markReadyIfInjected()) return;

      const existing = document.querySelector(
        `script[src="${TRUSTINDEX_CERT_SRC}"]`
      );
      if (existing) return;

      const script = document.createElement("script");
      script.src = TRUSTINDEX_CERT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.setTimeout(markReadyIfInjected, 1200);
      };
      document.body.appendChild(script);
    };

    const scheduleLoad = () => {
      if (cancelled || hasScheduledLoad) return;
      hasScheduledLoad = true;

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(injectScript, { timeout: 7000 });
      } else {
        timeoutId = window.setTimeout(injectScript, 5000);
      }
    };

    const onReadyState = () => {
      window.removeEventListener("load", onReadyState);
      armInteractionTriggers();
      armReviewTriggers();
      timeoutId = window.setTimeout(scheduleLoad, 9000);
    };

    const armInteractionTriggers = () => {
      const onInteract = () => {
        scheduleLoad();
      };

      const options = { passive: true, once: true };
      window.addEventListener("pointerdown", onInteract, options);
      window.addEventListener("keydown", onInteract, { once: true });
      window.addEventListener("touchstart", onInteract, options);

      cleanupInteraction = () => {
        window.removeEventListener("pointerdown", onInteract, options);
        window.removeEventListener("keydown", onInteract, { once: true });
        window.removeEventListener("touchstart", onInteract, options);
      };
    };

    const armReviewTriggers = () => {
      const reviewsSection = document.getElementById("reviews");

      if ("IntersectionObserver" in window && reviewsSection) {
        reviewObserver = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              scheduleLoad();
            }
          },
          { rootMargin: "300px 0px" }
        );
        reviewObserver.observe(reviewsSection);
        return;
      }

      const onScroll = () => {
        if (!reviewsSection) return;
        const rect = reviewsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 300) {
          scheduleLoad();
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupScroll = () => {
        window.removeEventListener("scroll", onScroll);
      };
    };

    if (document.readyState === "complete") {
      armInteractionTriggers();
      armReviewTriggers();
      timeoutId = window.setTimeout(scheduleLoad, 9000);
    } else {
      window.addEventListener("load", onReadyState, { once: true });
    }

    observer = new MutationObserver(() => {
      if (markReadyIfInjected() && observer) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", onReadyState);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (observer) {
        observer.disconnect();
      }
      if (reviewObserver) {
        reviewObserver.disconnect();
      }
      if (cleanupInteraction) {
        cleanupInteraction();
      }
      if (cleanupScroll) {
        cleanupScroll();
      }
    };
  }, []);

  if (widgetReady) return null;

  return (
    <a
      href={SITE.googleProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Google reviews and trust badge"
      className="fixed bottom-4 right-4 z-30 inline-flex min-h-[54px] items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-3 text-sm shadow-lg shadow-zinc-900/10 backdrop-blur-sm"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-lime-100 text-lime-700">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            d="M20 6 9 17l-5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-semibold text-zinc-900">Google reviews</span>
        <span className="text-xs text-zinc-500">Verified parking trust badge</span>
      </span>
    </a>
  );
}
