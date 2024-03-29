import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     - Match all paths except for:
     - 1. /api routes
     - 2. /_next (Next.js internals)
     - 3. /fonts (inside /public)
     - 4. /examples (inside /public)
     - 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  const hostname = req.headers.get("host") || "sviy.site"

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  console.log({path})

  const session = await getToken({ req });
  console.log({session})

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
        .replace('.sviy.site', "")
      : hostname.replace(/\.localhost:\d+/, "");
  //  console.log({currentHost})

   // rewrites for app pages
  if (currentHost == "app") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${path === "/" ? "" : path}`;
    console.log({urlPathnaem:url.pathname})
    return NextResponse.rewrite(url);
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