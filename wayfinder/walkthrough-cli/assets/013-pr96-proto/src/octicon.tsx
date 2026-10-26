/* Payload carries octicon *names* (prop contract, ticket #12); the renderer maps
   them to @primer/octicons-react components. */
import {
  BeakerIcon, BookIcon, ColumnsIcon, DatabaseIcon, DiffAddedIcon,
  DiffModifiedIcon, DiffRemovedIcon, EyeIcon, FileAddedIcon, FileDiffIcon,
  GearIcon, GitBranchIcon, GitCompareIcon, GlobeIcon, GraphIcon,
  LawIcon, LightBulbIcon, LinkIcon, ListUnorderedIcon, QuestionIcon,
  RowsIcon, ShieldLockIcon, TableIcon, CheckIcon, DashIcon,
  GitPullRequestIcon, GitCommitIcon, PersonIcon, FileIcon,
} from "@primer/octicons-react";

import type { ComponentType } from "react";

const MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  beaker: BeakerIcon,
  book: BookIcon,
  columns: ColumnsIcon,
  database: DatabaseIcon,
  "diff-added": DiffAddedIcon,
  "diff-modified": DiffModifiedIcon,
  "diff-removed": DiffRemovedIcon,
  eye: EyeIcon,
  file: FileIcon,
  "file-added": FileAddedIcon,
  "file-diff": FileDiffIcon,
  gear: GearIcon,
  "git-branch": GitBranchIcon,
  "git-commit": GitCommitIcon,
  "git-compare": GitCompareIcon,
  "git-pull-request": GitPullRequestIcon,
  globe: GlobeIcon,
  graph: GraphIcon,
  law: LawIcon,
  "light-bulb": LightBulbIcon,
  link: LinkIcon,
  "list-unordered": ListUnorderedIcon,
  person: PersonIcon,
  question: QuestionIcon,
  rows: RowsIcon,
  "shield-lock": ShieldLockIcon,
  table: TableIcon,
  check: CheckIcon,
  dash: DashIcon,
};

export function Octicon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const Icon = MAP[name];
  if (!Icon) return <span className="text-destructive font-mono text-[11px]">?{name}</span>;
  return <Icon size={size} className={className} />;
}

export const statusColor: Record<string, string> = {
  A: "text-added",
  M: "text-modified",
  D: "text-removed",
};

export function FileStatusIcon({ status, size = 14 }: { status: string; size?: number }) {
  const name = status === "A" ? "diff-added" : status === "D" ? "diff-removed" : "diff-modified";
  return <Octicon name={name} size={size} className={statusColor[status] ?? "text-context"} />;
}
