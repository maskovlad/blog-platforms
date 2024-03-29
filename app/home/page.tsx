import type { Metadata } from 'next'
import ExpEditor from "@/editor/ExpEditor";
//^ SVIY SITE HOME PAGE

export const metadata: Metadata = {
  title: 'Українська блогова платформа - Sviy.Site',
  description: 'Welcome to Next.js'
};


export default async function Page({ params }: { params: { site: string } }) {

  return (
    <article className="flex h-screen bg-black">
      <div className="m-auto w-48">
        <h1 className="text-white">Українська блогова платформа - Sviy.Site</h1>
        <ExpEditor />
      </div>
    </article>
  )

}
