import { ReactNode } from "react";
import type { Meta } from "@/types/seo";

import { Montserrat } from 'next/font/google';

// глобальні шрифти
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
})

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header></header>
      <main className={`${montserrat.className}`}>{children}</main>
      <footer></footer>
    </>
  )
}