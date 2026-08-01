/* Build-time shiki pass — stands in for the CLI compiling the document.
   Emits src/highlighted.json: snippet id → shiki HTML with .add/.hl line classes. */
import { writeFileSync } from "node:fs";
import { codeToHtml } from "shiki";
import { snippets } from "../src/snippets.mjs";

const inRanges = (ranges, n) => (ranges ?? []).some(([a, b]) => n >= a && n <= b);

const out = {};
for (const [id, s] of Object.entries(snippets)) {
  out[id] = await codeToHtml(s.code, {
    lang: s.lang,
    theme: "github-dark-default",
    transformers: [
      {
        line(node, line) {
          const cls = [];
          if (inRanges(s.added, line)) cls.push("add");
          if (inRanges(s.mark, line)) cls.push("hl");
          if (cls.length) this.addClassToHast(node, cls);
        },
      },
    ],
  });
}

writeFileSync(new URL("../src/highlighted.json", import.meta.url), JSON.stringify(out));
console.log(`highlighted ${Object.keys(out).length} snippets`);
