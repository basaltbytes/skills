import { useState } from "react";
import { Rich } from "./rich";

/* {% diagram %}: manual grid placement (col/row), click-to-section,
   hover lights up a node's edges. Rough SVG overlay between cell centers. */

const COLS = 3;

const edgeColor: Record<string, string> = {
  ctx: "var(--color-context)",
  derived: "var(--color-accent-muted)",
  new: "var(--color-added)",
};

const badgeCls: Record<string, string> = {
  new: "text-added bg-added/12 border-added/32",
  mod: "text-modified bg-modified/12 border-modified/32",
  hub: "text-modified bg-modified/12 border-modified/32",
};

export function Diagram({ intro, hint, nodes, edges }: any) {
  const [hover, setHover] = useState<string | null>(null);
  const rows = Math.max(...nodes.map((n: any) => n.row));
  const cellCenter = (n: any) => ({
    x: ((n.col - 0.5) / COLS) * 100,
    y: ((n.row - 0.5) / rows) * 100,
  });
  const byId = Object.fromEntries(nodes.map((n: any) => [n.id, n]));
  const lit = (e: any) => hover === null || e.from === hover || e.to === hover;

  return (
    <div className="my-4">
      {intro && <p className="text-[13px] text-secondary-foreground leading-relaxed mb-3"><Rich v={intro} /></p>}
      <div className="relative border border-border rounded-md bg-card p-4">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          {edges.map((e: any, k: number) => {
            const a = cellCenter(byId[e.from]);
            const b = cellCenter(byId[e.to]);
            return (
              <line
                key={k}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={edgeColor[e.kind] ?? "var(--color-context)"}
                strokeWidth={e.thick ? 1.1 : 0.45}
                strokeDasharray={e.kind === "derived" ? "2 1.4" : undefined}
                opacity={lit(e) ? 0.9 : 0.15}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        <div className="relative grid grid-cols-3 gap-x-6 gap-y-10">
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const n = nodes.find((n: any) => n.row === r + 1 && n.col === c + 1);
              if (!n) return <div key={`${r}-${c}`} />;
              const dim = hover !== null && hover !== n.id &&
                !edges.some((e: any) => (e.from === hover && e.to === n.id) || (e.to === hover && e.from === n.id));
              return (
                <a
                  key={n.id}
                  href={`#${n.ref}`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  className={`block border rounded-md bg-background transition-opacity ${dim ? "opacity-30" : ""} ${
                    n.change === "new" ? "border-added/50" : n.change === "mod" ? "border-modified/40" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border-soft">
                    <span className="font-mono text-[12px] text-foreground">{n.model}</span>
                    {n.badge && (
                      <span className={`text-[10.5px] border rounded-md px-[5px] py-[1px] ${badgeCls[n.badge] ?? ""}`}>{n.badge}</span>
                    )}
                    {!n.badge && n.nlabel && <span className="text-[11px] text-muted-foreground">{n.nlabel}</span>}
                  </div>
                  {n.compartments.map((cp: any, k: number) => (
                    <div key={k} className="px-3 py-1.5 border-b border-border-soft last:border-b-0">
                      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{cp.label}</div>
                      {cp.rows.map((row: any, j: number) => (
                        <div key={j} className="font-mono text-[11.5px] text-secondary-foreground"><Rich v={row} /></div>
                      ))}
                    </div>
                  ))}
                </a>
              );
            }),
          )}
        </div>
      </div>
      {hint && <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-2"><Rich v={hint} /></p>}
    </div>
  );
}
