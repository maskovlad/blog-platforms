import { ReactNode } from "react";
import { getSiteData } from '../../../lib/fetchers';
import type { Meta } from "@/types/seo";
import { Montserrat, Roboto, Lora } from 'next/font/google';
import { NextFont } from "next/dist/compiled/@next/font";

export async function generateMetadata({ params }: { params: { site: string } }): Promise<Meta> {
  const { site } = params;
  const data = await getSiteData(site);

  data ? console.log(data.name) : console.log("No data")

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
      //todo зробити динамічним, брати з настройок сайту
      icon: '/favicon_bird.png',
      shortcut: '/favicon_bird.png',
      apple: '/favicon_bird.png',
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
  weight: ["300", "500", "700"]
})

const lora = Lora({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
  weight: ["400", "500", "700"]
})

const roboto = Roboto({
  subsets: ['latin', 'cyrillic-ext'],
  display: 'swap',
  weight: ["300", "500", "700"]
})



export default async function Layout({
  params, children }: { params: { site: string }, children: ReactNode; }) {

  const { site } = params;

  const data = await getSiteData(site);

  const {font} = data

    console.log({site,font,params});
    

  let f:NextFont = montserrat

  switch (font) {
    case "font-mont":
      f = montserrat
      break;
  
    case "font-lora":
      f = lora
      break;
  
    case "font-robo":
      f = roboto
      break;
  
    default:
      break;
  }

  return (
    <>
      <header/>
      {/* <main>{children}</main> */}
      <main className={f.className}>{children}</main>
      <footer/>
    </>
  )
}