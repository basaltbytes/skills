/* Smoke test: render the whole app to a string; any component crash fails it. */
import { renderToString } from "react-dom/server";
import App from "../src/App";
import { CodeBlock } from "../src/codeblock";

const diffHtml = renderToString(<CodeBlock snippet="slot-link" view="diff" />);
if (!diffHtml.includes("diff")) {
  console.error("DIFF VIEW EMPTY");
  process.exit(1);
}
const html = renderToString(<App />);
const checks = [
  "planning.pool.item",
  "Remaining to Schedule",
  "test_pool_grain",
  "fr.po",
  "Patterns worth stealing",
  "_planning_placed_hours_by_id",
  "pinned at",
];
const missing = checks.filter((c) => !html.includes(c));
if (missing.length) {
  console.error("MISSING:", missing);
  process.exit(1);
}
console.log(`SSR ok — ${html.length} chars, all ${checks.length} probes found`);
