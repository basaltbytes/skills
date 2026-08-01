import { payload } from "./payload";
import { Nav } from "./nav";
import { Block } from "./widgets";
import { Octicon } from "./octicon";
import { Tag } from "./rich";

const badgeTone: Record<string, string> = {
  new: "text-added bg-added/12 border-added/32",
  mod: "text-modified bg-modified/12 border-modified/32",
};

export default function App() {
  const { pr, meta } = payload;
  return (
    <div className="mx-auto max-w-[1240px] flex gap-8 px-6">
      <aside className="w-[250px] shrink-0 hidden md:block">
        <div className="sticky top-0 max-h-screen overflow-y-auto py-8 pr-2">
          <Nav />
        </div>
      </aside>

      <main className="min-w-0 flex-1 max-w-[920px] py-8">
        {/* ---- PR header: CLI-computed from frontmatter pr+commit ---- */}
        <header className="mb-8">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <Octicon name="git-pull-request" size={18} className="text-open" />
            <h1 className="text-[22px] font-semibold">
              {payload.title} <span className="text-muted-foreground font-normal">#{pr.number}</span>
            </h1>
          </div>
          <div className="flex items-center flex-wrap gap-2 text-[13px] text-muted-foreground">
            <span className="text-primary-foreground bg-open rounded-full px-3 py-[3px] text-[12px] font-medium inline-flex items-center gap-1">
              <Octicon name="git-pull-request" size={13} /> Open
            </span>
            <span>
              <b className="text-secondary-foreground">{pr.author}</b> wants to merge {pr.commits} commit into{" "}
              <Tag>{pr.base}</Tag> from <Tag>{pr.head}</Tag>
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Octicon name="file-diff" size={14} /> {pr.stats.files} files
            </span>
            <span className="font-mono"><span className="text-added">+{pr.stats.additions}</span>{" "}
              <span className="text-context">−{pr.stats.deletions}</span></span>
            <span className="inline-flex items-center gap-1.5">
              <Octicon name="git-commit" size={14} />
              pinned at <span className="font-mono text-accent-muted">{payload.commit}</span>
              {payload.headDistance > 0 && (
                <span className="text-modified">head moved by {payload.headDistance} commits</span>
              )}
            </span>
            {Object.entries(meta).map(([k, v]) => (
              <Tag key={k}>{k}={v}</Tag>
            ))}
          </div>
        </header>

        {/* ---- sections ---- */}
        {payload.sections.map((s: any) => (
          <section key={s.id} id={s.id} className="mb-12">
            <div className="flex items-center flex-wrap gap-2.5 border-b border-border pb-2 mb-4">
              <Octicon name={s.icon} size={17} className="text-muted-foreground" />
              <h2 className="text-[18px] font-semibold">{s.title}</h2>
              {s.badge && (
                <span className={`text-[11px] border rounded-md px-[7px] py-[2px] ${badgeTone[s.badge.tone]}`}>
                  {s.badge.label}
                </span>
              )}
              {s.file && <span className="font-mono text-[12px] text-muted-foreground truncate">{s.file}</span>}
            </div>
            {s.blocks.map((b: any, k: number) => <Block key={k} block={b} />)}
          </section>
        ))}

        <footer className="border-t border-border pt-4 text-[12.5px] text-muted-foreground">
          Generated walkthrough of <b className="text-secondary-foreground">{payload.title}</b> (#{pr.number}) ·{" "}
          <span className="font-mono">{pr.head}</span> → <span className="font-mono">{pr.base}</span>. Read-only artifact.
        </footer>
      </main>
    </div>
  );
}
