/**
 * Server-side reveal wrapper.
 *
 * Formerly this component used IntersectionObserver per instance.
 * For Lighthouse/TBT we keep the styling contract but render content
 * as already visible, while preserving optional transition delay hooks.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const cls = `reveal reveal-on${className ? ` ${className}` : ""}`;
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag className={cls} style={style} {...rest}>
      {children}
    </Tag>
  );
}
