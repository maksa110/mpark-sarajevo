"use client";

export default function ViberLinkButton({
  href,
  fallbackHref,
  ariaLabel,
  title,
  className,
  children,
}) {
  function handleClick(event) {
    if (!href || !href.startsWith("viber://")) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    let didLeavePage = false;

    const markLeftPage = () => {
      didLeavePage = true;
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", markLeftPage);
      window.removeEventListener("blur", markLeftPage);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        markLeftPage();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", markLeftPage, { once: true });
    window.addEventListener("blur", markLeftPage, { once: true });

    window.location.assign(href);

    window.setTimeout(() => {
      cleanup();
      if (!didLeavePage && fallbackHref) {
        window.location.assign(fallbackHref);
      }
    }, 1200);
  }

  return (
    <a
      href={href || fallbackHref}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={title}
      className={className}
    >
      {children}
    </a>
  );
}
