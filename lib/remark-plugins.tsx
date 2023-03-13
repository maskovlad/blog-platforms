import Link from "next/link";
import type { WithChildren } from "@/types";

export function replaceLinks(options: { href?: string } & WithChildren) {
  // this is technically not a remark plugin but it
  // replaces internal links with <Link /> component
  // and external links with <a target="_blank" />
  return options.href?.startsWith("/") || options.href === "" ? (
    <Link href={options.href} className="cursor-pointer">
      {options.children}
    </Link>
  ) : (
    <a href={options.href} target="_blank" rel="noopener noreferrer">
      {options.children} ↗
    </a>
  );
}
