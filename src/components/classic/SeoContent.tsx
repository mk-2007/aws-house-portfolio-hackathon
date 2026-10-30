import ContentSections from "./ContentSections";

/**
 * Visually hidden copy of the portfolio text. It lives in the static HTML
 * that `next build` exports, so search engines and AI scorers that do not
 * run WebGL still see real headings and text. `inert` keeps it out of the
 * tab order and the accessibility tree - screen-reader users get the
 * visible Classic view instead (the first focusable button on the page).
 */
export default function SeoContent() {
  return (
    <div className="sr-only" inert>
      <ContentSections withLinks={false} />
    </div>
  );
}
