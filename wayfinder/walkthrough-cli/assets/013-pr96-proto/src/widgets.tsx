import { Rich, Tag } from "./rich";
import { Octicon, FileStatusIcon, statusColor } from "./octicon";
import { CodeBlock } from "./codeblock";
import { Diagram } from "./diagram";
import { payload } from "./payload";

/* ------- markdown prose (replaces v0 p/h3/intro per ticket #12) ------- */
export function Md({ nodes }: { nodes: any[] }) {
  return (
    <>
      {nodes.map((n, k) =>
        "h" in n ? (
          <h3 key={k} className="text-[15px] font-semibold mt-5 mb-2">{n.h}</h3>
        ) : (
          <p key={k} className="my-3 leading-relaxed text-secondary-foreground">
            <Rich v={n.p} />
          </p>
        ),
      )}
    </>
  );
}

/* ------------------------------ callout ------------------------------ */
export function Callout({ tone, body }: { tone?: "key" | "warn"; body: any[] }) {
  const styles =
    tone === "key"
      ? "border-primary/50 bg-primary/10"
      : tone === "warn"
        ? "border-modified/50 bg-modified/10"
        : "border-border bg-card";
  return (
    <div className={`my-4 border rounded-md px-4 py-3 leading-relaxed text-secondary-foreground ${styles}`}>
      <Rich v={body} />
    </div>
  );
}

/* -------------------------------- flow -------------------------------- */
export function Flow({ steps }: { steps: { body: any[]; tag?: string }[] }) {
  return (
    <div className="my-4 flex flex-wrap items-center gap-y-2 text-[13px]">
      {steps.map((s, k) => (
        <span key={k} className="inline-flex items-center">
          <span className="inline-flex items-center gap-2 border border-border bg-card rounded-md px-3 py-[6px]">
            <Rich v={s.body} />
            {s.tag && <Tag>{s.tag}</Tag>}
          </span>
          {k < steps.length - 1 && <span className="mx-2 text-muted-foreground">→</span>}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------- attrs ------------------------------- */
export function Attrs({ items }: { items: string[] }) {
  return (
    <div className="my-3 flex flex-wrap gap-2">
      {items.map((a, k) => (
        <span key={k} className="font-mono text-[12px] text-accent-muted bg-card border border-border rounded-md px-2 py-[3px]">
          {a}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------- fields ------------------------------- */
export function Fields({ rows }: { rows: any[] }) {
  return (
    <div className="my-4 border border-border rounded-md overflow-hidden">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-card text-left text-muted-foreground">
            <th className="px-3 py-2 font-medium">Field</th>
            <th className="px-3 py-2 font-medium">Kind</th>
            <th className="px-3 py-2 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k} className="border-t border-border-soft align-top">
              <td className="px-3 py-2 font-mono whitespace-nowrap text-foreground">
                {r.name}
                {r.badges?.map((b: string) => (
                  <span key={b} className="ml-2 text-[10.5px] font-sans text-done bg-done/12 border border-done/32 rounded-md px-[5px] py-[1px]">
                    {b}
                  </span>
                ))}
              </td>
              <td className="px-3 py-2 font-mono whitespace-nowrap text-accent-muted">{r.kind}</td>
              <td className="px-3 py-2 text-secondary-foreground leading-relaxed">
                <Rich v={r.note} />
                {r.tags && (
                  <span className="mt-1.5 flex flex-wrap gap-1">
                    {r.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------- method ------------------------------- */
export function Method({ decorator, sig, body }: { decorator?: string; sig: string; body: any[] }) {
  return (
    <div className="my-3 border border-border rounded-md bg-card px-4 py-3">
      {decorator && <div className="font-mono text-[12px] text-done">{decorator}</div>}
      <div className="font-mono text-[13px] text-accent-muted mb-1">{sig}</div>
      <div className="text-[13px] text-secondary-foreground leading-relaxed"><Rich v={body} /></div>
    </div>
  );
}

/* ------------------------------- tests ------------------------------- */
export function Tests({ items }: { items: any[] }) {
  return (
    <div className="my-4 grid gap-3 md:grid-cols-2">
      {items.map((t, k) => (
        <div key={k} className="border border-border rounded-md bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Octicon name="beaker" size={14} className="text-done" />
            <span className="font-mono text-[13px] text-foreground">{t.name}</span>
            <Tag>{t.kind}</Tag>
          </div>
          <div className="text-[13px] text-secondary-foreground leading-relaxed mb-2">
            <Rich v={t.scenario} />
          </div>
          <ul className="space-y-1">
            {t.asserts.map((a: any[], j: number) => (
              <li key={j} className="text-[13px] text-secondary-foreground leading-relaxed flex gap-2">
                <Octicon name="check" size={14} className="text-added mt-[3px] shrink-0" />
                <span><Rich v={a} /></span>
              </li>
            ))}
          </ul>
          {t.ref && <div className="mt-2 font-mono text-[11.5px] text-muted-foreground">{t.ref}</div>}
        </div>
      ))}
    </div>
  );
}

/* --------------------- native table + matrix wrapper --------------------- */
export function NativeTable({ head, rows, firstColMono }: { head: any[][]; rows: any[][][]; firstColMono?: boolean }) {
  return (
    <div className="my-4 border border-border rounded-md overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-card text-left text-muted-foreground">
            {head.map((h, k) => <th key={k} className="px-3 py-2 font-medium"><Rich v={h} /></th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k} className="border-t border-border-soft align-top">
              {r.map((cell, j) => (
                <td key={j} className={`px-3 py-2 leading-relaxed ${j === 0 && firstColMono ? "font-mono whitespace-nowrap text-foreground" : "text-secondary-foreground"}`}>
                  <Rich v={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Matrix({ head, rows }: { head: string[]; rows: { label: string; cells: boolean[] }[] }) {
  return (
    <div className="my-4 border border-border rounded-md overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-card text-left text-muted-foreground">
            {head.map((h, k) => (
              <th key={k} className={`px-3 py-2 font-medium ${k > 0 ? "text-center w-20" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k} className="border-t border-border-soft">
              <td className="px-3 py-2 font-mono whitespace-nowrap text-foreground">{r.label}</td>
              {r.cells.map((c, j) => (
                <td key={j} className="px-3 py-2 text-center">
                  {c ? (
                    <Octicon name="check" size={14} className="text-added" />
                  ) : (
                    <Octicon name="dash" size={14} className="text-context" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------- files (computed) --------------------------- */
export function Files({ only }: { only?: string }) {
  const rows = payload.files;
  const max = Math.max(...rows.map((f) => f.add + f.del));
  return (
    <div className="my-4 border border-border rounded-md overflow-hidden">
      {rows.map((f, k) => (
        <div key={k} className="flex items-center gap-3 px-3 py-[7px] border-b border-border-soft last:border-b-0 font-mono text-[12.5px]">
          <FileStatusIcon status={f.status} />
          {f.ref ? (
            <a href={`#${f.ref}`} className="text-foreground hover:text-primary truncate">{f.path}</a>
          ) : (
            <span className="text-secondary-foreground truncate">{f.path}</span>
          )}
          <span className="ml-auto shrink-0 text-added">+{f.add}</span>
          <span className={`shrink-0 ${f.del ? "text-removed" : "text-context"}`}>−{f.del}</span>
          <span className="shrink-0 w-14 h-[6px] rounded-sm bg-secondary overflow-hidden">
            <i className="block h-full bg-added" style={{ width: `${Math.max(6, Math.round(((f.add + f.del) / max) * 100))}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- i18n (computed) ---------------------------- */
export function I18n({ rows, note }: { rows: any[]; note?: any[] }) {
  return (
    <div className="my-4">
      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-card text-left text-muted-foreground">
              <th className="px-3 py-2 font-medium">File</th>
              <th className="px-3 py-2 font-medium">Lang</th>
              <th className="px-3 py-2 font-medium">Lines</th>
              <th className="px-3 py-2 font-medium">Entries</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, k) => (
              <tr key={k} className="border-t border-border-soft">
                <td className="px-3 py-2 font-mono text-foreground">
                  <span className="inline-flex items-center gap-2">
                    <FileStatusIcon status={r.status} />
                    {r.path}
                  </span>
                  {r.note && <span className="ml-2 font-sans text-[12px] text-muted-foreground">({r.note})</span>}
                </td>
                <td className="px-3 py-2">{r.lang ? <Tag>{r.lang}</Tag> : <span className="text-muted-foreground">—</span>}</td>
                <td className="px-3 py-2 font-mono"><span className="text-added">+{r.add}</span> <span className="text-context">−{r.del}</span></td>
                <td className="px-3 py-2">
                  {r.entries.new != null && <span className="text-added">{r.entries.new} new</span>}
                  {r.entries.updated != null && <span className="text-modified ml-2">{r.entries.updated} updated</span>}
                  {r.entries.removed != null && <span className="text-removed ml-2">{r.entries.removed} removed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed"><Rich v={note} /></p>}
    </div>
  );
}

/* -------------------------------- cards -------------------------------- */
export function Cards({ cols, items }: { cols: number; items: any[] }) {
  const grid = cols === 3 ? "md:grid-cols-3" : cols === 2 ? "md:grid-cols-2" : "";
  return (
    <div className={`my-4 grid gap-3 ${grid}`}>
      {items.map((c, k) => (
        <div key={k} className="border border-border rounded-md bg-card p-4">
          {(c.icon || c.title) && (
            <div className="flex items-center gap-2 mb-2 font-semibold text-[13.5px]">
              {c.icon && <Octicon name={c.icon} size={15} className="text-muted-foreground" />}
              {c.title}
            </div>
          )}
          {c.body.map((par: any[], j: number) => (
            <p key={j} className="text-[13px] text-secondary-foreground leading-relaxed my-1.5 first:mt-0 last:mb-0">
              <Rich v={par} />
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- patterns ------------------------------- */
export function Patterns({ items }: { items: any[] }) {
  return (
    <div className="my-4 grid gap-3 md:grid-cols-2">
      {items.map((p, k) => (
        <div key={k} className="border border-border rounded-md bg-card p-4 flex gap-3">
          <Octicon name={p.icon} size={16} className="text-accent-muted mt-[2px] shrink-0" />
          <div>
            <div className="font-semibold text-[13.5px] mb-1">{p.term}</div>
            <div className="text-[13px] text-secondary-foreground leading-relaxed"><Rich v={p.body} /></div>
            {p.ref && <div className="mt-1.5 font-mono text-[11.5px] text-muted-foreground">{p.ref}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------- block dispatcher ------------------------- */
export function Block({ block }: { block: any }) {
  switch (block.b) {
    case "md": return <Md nodes={block.nodes} />;
    case "callout": return <Callout tone={block.tone} body={block.body} />;
    case "flow": return <Flow steps={block.steps} />;
    case "attrs": return <Attrs items={block.items} />;
    case "fields": return <Fields rows={block.rows} />;
    case "method": return <Method decorator={block.decorator} sig={block.sig} body={block.body} />;
    case "tests": return <Tests items={block.items} />;
    case "table": return <NativeTable head={block.head} rows={block.rows} firstColMono={block.firstColMono} />;
    case "matrix": return <Matrix head={block.head} rows={block.rows} />;
    case "files": return <Files only={block.only} />;
    case "i18n": return <I18n rows={block.rows} note={block.note} />;
    case "cards": return <Cards cols={block.cols} items={block.items} />;
    case "patterns": return <Patterns items={block.items} />;
    case "code": return <CodeBlock snippet={block.snippet} view={block.view} collapsed={block.collapsed} />;
    case "diagram": return <Diagram {...block} />;
    default:
      return <div className="my-3 border border-destructive rounded-md p-3 text-destructive font-mono text-[12px]">unknown block: {String(block.b)}</div>;
  }
}
