/** Emituje jedan ili više JSON-LD script tagova. */
export default function JsonLdScripts({ schemas }) {
  const list = Array.isArray(schemas) ? schemas : [schemas];
  return (
    <>
      {list.map((schema, i) => (
        <script
          key={`ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
