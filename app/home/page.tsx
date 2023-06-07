import Image from "next/image";
import type { Metadata } from 'next'

//^ SVIY SITE HOME PAGE

export const metadata: Metadata = {
  title: 'Українська блогова платформа - Sviy.Site',
  description: 'Welcome to Next.js',
};

export default async function Page({ params }: { params: { site: string } }) {

  return (
    <article className="flex h-screen bg-black">
      <div className="m-auto w-48">
        <h1 className="text-white">Українська блогова платформа - Sviy.Site</h1>
        <Image
          width={512}
          height={512}
          src="/logo.png"
          alt="Українська блогова платформа - Sviy.Site"
        />
      </div>
    </article>
  )

}
