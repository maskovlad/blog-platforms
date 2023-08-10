import { cn } from "@/lib/utils";
import Image from "next/image";

export default async function HomePage() {
  
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <Image
        width={512}
        height={512}
        src="/logo.png"
        alt="Platforms on Vercel"
        className="w-48"
      />
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
