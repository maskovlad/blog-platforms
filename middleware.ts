import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     - Match all paths except for:
     - 1. /api routes
     - 2. /_next (Next.js internals)
     - 3. /_static (inside /public)
     - 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  const hostname = req.headers.get("host") || "sviy.site"

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
        .replace('.sviy.site', "")
      : hostname.replace(/\.localhost:\d+/, "");

   // rewrites for app pages
  if (currentHost == "app") {
    const session = await getToken({ req });
    console.log({sessionName: session?.name})
    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite root application to `/home` folder
  if (hostname === "sviy.site" || hostname.startsWith("localhost:")) {
    url.pathname = `/home${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  url.pathname = `/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);

}
