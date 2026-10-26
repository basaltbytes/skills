import { useMemo, useState } from "react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import "@git-diff-view/react/styles/diff-view.css";
import highlighted from "./highlighted.json";
import { snippets } from "./snippets.mjs";
import { FileStatusIcon } from "./octicon";

type View = "plain" | "change" | "diff";

const inRanges = (ranges: number[][] | undefined, n: number) =>
  (ranges ?? []).some(([a, b]) => n >= a && n <= b);

/* {% code %}: one resolved payload, three reader-switchable views (ticket #12). */
export function CodeBlock({ snippet, view = "change", collapsed = false }: {
  snippet: string; view?: View; collapsed?: boolean;
}) {
  const s = (snippets as any)[snippet];
  const [mode, setMode] = useState<View>(view);
  const [open, setOpen] = useState(!collapsed);
  const html = (highlighted as Record<string, string>)[snippet];
  const status = s.added?.[0]?.[0] === 1 && inRanges(s.added, s.code.split("\n").length) ? "A" : "M";

  return (
    <div className="codeblock border border-border rounded-[11px] overflow-hidden bg-background">
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-card border-b border-border">
        <button
          className="font-mono text-[12px] text-secondary-foreground inline-flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
          title={open ? "collapse" : "expand"}
        >
          <FileStatusIcon status={status} />
          {s.file}
        </button>
        <div className="flex items-center gap-1 text-[11px]">
          {(["plain", "change", "diff"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => { setMode(v); setOpen(true); }}
              className={
                "px-2 py-[2px] rounded-md border cursor-pointer " +
                (mode === v
                  ? "border-primary/50 text-foreground bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {open && (mode === "diff" ? (
        <SplitDiff snippet={snippet} />
      ) : (
        <div className={mode === "change" ? "view-change" : "view-plain"}
             dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </div>
  );
}

/* diff view on @git-diff-view/react (ticket #8): old = context lines, new = blob at pin */
function SplitDiff({ snippet }: { snippet: string }) {
  const s = (snippets as any)[snippet];
  const file = useMemo(() => {
    const lines: string[] = s.code.split("\n");
    const oldContent = lines.filter((_, idx) => !inRanges(s.added, idx + 1)).join("\n");
    const f = generateDiffFile(s.file, oldContent, s.file, s.code, s.lang, s.lang);
    f.initRaw();
    return f;
  }, [snippet]);
  return (
    <div data-theme="dark" className="text-[12px]">
      <DiffView
        diffFile={file}
        diffViewMode={DiffModeEnum.Split}
        diffViewHighlight
        diffViewTheme="dark"
        diffViewFontSize={12}
        diffViewWrap={false}
      />
    </div>
  );
}
