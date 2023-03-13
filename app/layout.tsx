/* eslint-disable @next/next/no-head-element */

// ^кореневий layout юзерського сайту
// ^приймає children встановлює шрифт
// These styles apply to every route in the application
import "@/styles/globals.css";

import { Montserrat } from 'next/font/google';

// глобальні шрифти
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head />
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
