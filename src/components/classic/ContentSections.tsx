import {
  PERSON,
  ABOUT,
  SKILL_GROUPS,
  PROJECT_LIST,
  LINKS,
} from "@/content/siteContent";

/**
 * The three core sections as plain semantic HTML. Used twice:
 * visible inside ClassicView, and hidden inside SeoContent. Real headings
 * (h1/h2/h3), lists and links are what crawlers and screen readers read.
 */
export default function ContentSections({
  withLinks = true,
  idPrefix = "",
}: {
  withLinks?: boolean;
  /** Prefix for element ids, so the hidden SEO copy never duplicates the
   *  visible copy's ids (duplicate ids break #anchor navigation). */
  idPrefix?: string;
}) {
  return (
    <>
      <header>
        <h1>{PERSON.name} &mdash; Portfolio</h1>
        <p>{PERSON.role}</p>
        <p>{PERSON.school}</p>
        <p>&ldquo;{PERSON.motto}&rdquo;</p>
      </header>

      <section id={`${idPrefix}about`} aria-labelledby={`${idPrefix}about-h`}>
        <h2 id={`${idPrefix}about-h`}>About Me</h2>
        {ABOUT.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <h3>Engineering Philosophy</h3>
        <ol>
          {ABOUT.philosophy.map((p) => (
            <li key={p.title}>
              <strong>{p.title}.</strong> {p.body}
            </li>
          ))}
        </ol>
      </section>

      <section id={`${idPrefix}skills`} aria-labelledby={`${idPrefix}skills-h`}>
        <h2 id={`${idPrefix}skills-h`}>Skills &amp; Tech Superpowers</h2>
        {SKILL_GROUPS.map((g) => (
          <div key={g.title}>
            <h3>{g.title}</h3>
            <ul>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id={`${idPrefix}projects`} aria-labelledby={`${idPrefix}projects-h`}>
        <h2 id={`${idPrefix}projects-h`}>Projects</h2>
        {PROJECT_LIST.map((p) => (
          <article key={p.id}>
            <h3>{p.name}</h3>
            <p>
              <em>{p.tagline}</em>
            </p>
            <p>{p.description}</p>
            <p>Built with: {p.stack.join(", ")}</p>
            {withLinks && p.githubUrl && (
              <p>
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                  View {p.name} on GitHub
                </a>
              </p>
            )}
          </article>
        ))}
      </section>

      <section id={`${idPrefix}contact`} aria-labelledby={`${idPrefix}contact-h`}>
        <h2 id={`${idPrefix}contact-h`}>Contact</h2>
        <ul>
          {LINKS.map((l) => (
            <li key={l.label}>
              {withLinks ? (
                <a
                  href={l.href}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {l.label}: {l.text}
                </a>
              ) : (
                <>
                  {l.label}: {l.text}
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
