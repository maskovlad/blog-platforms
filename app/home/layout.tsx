import { ReactNode } from "react";
import type { Meta } from "@/types";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-20">{children}</div>
  )
}