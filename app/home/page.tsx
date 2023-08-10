import { cn } from "@/lib/utils";
import Image from "next/image";
import { getPostsForSite } from "@/lib/fetchers";

export default async function HomePage() {
  const data = await getPostsForSite("test.localhost:3000")
  
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <Image
        width={512}
        height={512}
        src="/logo.png"
        alt="Platforms on Vercel"
        className="w-48"
      />
      {data && data.map((item)=> <h2 className="text-white">title: {item.title}</h2>)}
      <h1 className="text-white">
        <InlineSnippet className="ml-2 bg-blue-900 text-blue-100">
          app/home/page.tsx
        </InlineSnippet>
      </h1>
    </div>
  );
}

const InlineSnippet = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  return (
    <span
      className={cn(
        "inline-block rounded-md bg-blue-100 px-1 py-0.5 font-mono text-blue-900 dark:bg-blue-900 dark:text-blue-100",
        className,
      )}
    >
      {children}
    </span>
  );
};
