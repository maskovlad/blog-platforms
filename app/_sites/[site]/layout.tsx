import { ReactNode } from "react";
import { getSiteData } from '../../../lib/fetchers';
import type { Meta } from "@/types";
import { Montserrat } from 'next/font/google';
import { Roboto } from 'next/font/google';

let font: string;

export async function generateMetadata({ params }: { params: { site: string } }): Promise<Meta> {
  const { site } = params;
  const data = await getSiteData(site);
  font = data.font
  return {
    title: data.name,
    description: data.description,
    //! ТРЕБА ДОРОБИТИ
    // docs https://beta.nextjs.org/docs/api-reference/metadata
    openGraph: {
      title: data.name,
      description: data.description,
      url: data.customDomain
        ? `https://${data.customDomain}`
        : `https://${data.subdomain}.sviy.site`,
      siteName: data.name,
      images: [
        {
          url: 'https://nextjs.org/og.png',
          width: 800,
          height: 600,
        },
        {
          url: 'https://nextjs.org/og-alt.png',
          width: 1800,
          height: 1600,
          alt: 'My custom alt',
        },
      ],
      locale: 'uk-UK',
      type: 'website',
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // output
    // < meta name = "robots" content = "noindex, follow, nocache" />
    // <meta
    //   name="googlebot"
    //   content="index, nofollow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
    icons: {
      icon: '/icon.png',
      shortcut: '/shortcut-icon.png',
      apple: '/apple-icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    },
    // output
    // <link rel = "shortcut icon" href = "/shortcut-icon.png" />
    // <link rel="icon" href="/icon.png" />
    // <link rel="apple-touch-icon" href="/apple-icon.png" />
    // <link
    //   rel="apple-touch-icon-precomposed"
    //   href="/apple-touch-icon-precomposed.png"
    // />
  } as Meta
}

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
  weight: ["300", "500"]
})



export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {

  if (!font) return 'Loading...'
  return await (
    <>
      <header></header>
      {/* {font && font === "font-cal"
        ? (<main className={montserrat.className}>{children}</main>)
        : font && font === "font-lora"
          ? (<main className={roboto.className}>{children}</main>)
          : null
      } */}
      <main className={montserrat.className}>{children}</main>
      <footer></footer>
    </>
  )
}