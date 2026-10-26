import { useEffect, useState } from "react";
import { Octicon, FileStatusIcon, statusColor } from "./octicon";
import { payload } from "./payload";

/* Sidebar = the payload's nav tree (model B, ticket #12), rendered as data. */
export function Nav() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="text-[13px] leading-tight">
      {payload.nav.map((g: any) => (
        <div key={g.label} className="mb-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5 px-2">{g.label}</div>
          {g.children.map((item: any) => {
            const isActive = active === item.ref;
            return (
              <a
                key={item.ref}
                href={`#${item.ref}`}
                className={`flex items-center gap-2 px-2 py-[5px] rounded-md border-l-2 ${
                  isActive
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-transparent text-secondary-foreground hover:bg-secondary/60"
                }`}
              >
                {item.kind === "file" ? (
                  <>
                    <FileStatusIcon status={item.status} size={13} />
                    <span className={`font-mono text-[12px] truncate ${statusColor[item.status]}`}>{item.label}</span>
                  </>
                ) : (
                  <>
                    <Octicon name={item.icon} size={14} className="text-muted-foreground shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
