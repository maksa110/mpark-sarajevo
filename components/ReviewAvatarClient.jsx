"use client";

import { useState } from "react";

export default function ReviewAvatarClient({
  name,
  src,
  href,
  ariaAlt,
  authorAria,
  initials,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  const inner = showImage ? (
    <img
      src={src}
      alt={ariaAlt}
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className="h-10 w-10 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  ) : (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-sm font-bold text-lime-700"
      title={name}
    >
      {initials}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={authorAria}
        className="shrink-0"
      >
        {inner}
      </a>
    );
  }

  return <span className="shrink-0">{inner}</span>;
}
