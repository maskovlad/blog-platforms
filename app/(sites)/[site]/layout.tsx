import { ReactNode } from "react";
import { getSiteData } from '../../../lib/fetchers';
import type { Meta } from "@/types";
import { Montserrat, Roboto, Lora } from 'next/font/google';

export async function generateMetadata({ params }: { params: { site: string } }): Promise<Meta> {
  const { site } = params;
  const data = await getSiteData(site);
  
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

const lora = Lora({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
  weight: ["300", "500"]
})



export default async function Layout({
  params, children }: { params: { site: string }, children: ReactNode; }) {

  const { site } = params;

  const data = await getSiteData(site);

  let font = montserrat

  switch (data.font) {
    case "font-mont":
      font = montserrat
      break;
  
    case "font-lora":
      font = lora
      break;
  
    case "font-robo":
      font = roboto
      break;
  
    default:
      break;
  }

  return (
    <>
      <header/>
      <main className={font.className}>{children}</main>
      <footer/>
    </>
  )
}