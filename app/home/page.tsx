import Image from "next/image";
import type { Metadata } from 'next'

//^ SVIY SITE HOME PAGE

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
};

export default async function Page({ params }: { params: { site: string } }) {

  return (
    <div className="flex h-screen bg-black">
      <div className="m-auto w-48">
        <h1 className="text-white">Platforms on Vercel</h1>
        <Image
          width={512}
          height={512}
          src="/logo.png"
          alt="Platforms on Vercel"
        />
      </div>
    </div>
  )

}
