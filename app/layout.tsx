/* eslint-disable @next/next/no-head-element */

// ^кореневий layout юзерського сайту
// ^приймає children встановлює шрифт
// These styles apply to every route in the application
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head />
      <body>
        {children}  
      </body>
    </html>
  );
}
