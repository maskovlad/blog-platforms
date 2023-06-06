import BlogCard from "@/components/BlogCard";
import BlurImage from "@/components/BlurImage";
import prisma from "@/lib/prisma";
import { Text } from 'slate'
import Highlight from 'react-highlight'
import type { AdjacentPost, Meta, _SiteSlugData } from "@/types";
import { placeholderBlurhash } from "@/lib/util";
import { getPostData } from "@/lib/fetchers";
import { css } from "@emotion/css";

//^ SINGLE POST

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      // you can remove this if you want to generate all sites at build time
      site: {
        subdomain: "demo",
      },
    },
    select: {
      slug: true,
      site: {
        select: {
          subdomain: true,
          customDomain: true,
        },
      },
    },
  });

  return posts.flatMap((post) => {
    if (post.site === null || post.site.subdomain === null) return [];

    if (post.site.customDomain) {
      return [
        {
          site: post.site.customDomain,
          slug: post.slug,
        },
        {
          site: post.site.subdomain,
          slug: post.slug,
        },
      ];
    } else {
      return {
        site: post.site.subdomain,
        slug: post.slug,
      };
    }
  });
}

// const serialize = (node) => {
//   console.log({node})
//   if (Text.isText(node)) {
//     if (node.code) {
//       return <Highlight className="h-full">{node.text}</Highlight>
//     }
//     if (node['heading-one']) {
//       return (
//         <h1 className="text-3xl font-cal md:text-6xl mb-10 text-gray-800">
//           {node.text}
//         </h1>
//       )
//     }

//     if (node.bold && node.italic) {
//       return <p className="font-bold italic font-cal">{node.text}</p>
//     }

//     if (node.bold) {
//       return <p className="font-bold font-cal">{node.text}</p>
//     }

//     if (node.italic) {
//       return <p className="font-italic font-cal">{node.text}</p>
//     }

//     if (node['heading-two']) {
//       return <p className="text-2xl font-cal">{node.text}</p>
//     }

//     return node.text
//   }

//   const children = node?.children.map((n) => serialize(n))

//   switch (node.type) {
//     case 'block-quote':
//       return <blockquote>{children}</blockquote>
//     case 'italic':
//       return <em className="italic">{children}</em>
//     case 'underline':
//       return <p className="underline">{children}</p>

//     case 'heading-one':
//       return <h1 className="text-4xl">{children}</h1>
//     case 'heading-two':
//       return <h2 className="text-2xl">{children}</h2>
//     case 'code':
//       return <code className="bg-gray-50 p-2 m-2">{children}</code>

//     case 'list-item':
//       return <li>{children}</li>
//     case 'numbered-list':
//       return <ol>{children}</ol>
//     default:
//       return <p>{children}</p>
//   }
// }

export default async function Post({
  params,
}: {
  params: {
    site: string;
    slug: string;
  };
}) {
  const { site, slug } = params;
  const { data, adjacentPosts } = await getPostData(site, slug);

  // console.log({ PostContent: data?.content })

  if (!data) return null;

  const meta = {
    description: data.description,
    logo: "/logo.png",
    ogImage: data.image,
    ogUrl: `${process.env.NEXT_PUBLIC_SITE_PROTOCOL}${data.site?.subdomain}.${process.env.NEXT_PUBLIC_SITE_URL}/${data.slug}`,
    title: data.title,
  } as Meta;

  

  return (

    <div>
      {/* Заголовок посту - title, description, date, author */}
      <div className="flex flex-col justify-center items-center">
        <div className="text-center w-full md:w-7/12 m-auto">
          <p className="text-sm md:text-base font-light text-gray-500 w-10/12 m-auto my-5">
            {data.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="font-bold text-3xl font-title md:text-6xl mb-10 text-gray-800">
            {data.title}
          </h1>
          <p className="text-md md:text-lg text-gray-600 w-10/12 m-auto">
            {data.description}
          </p>
        </div>
        <a
          // TODO: посилання на автора взяти з реєстрації, якщо по email - mailto
          href={
            data.site?.user?.username
              ? `https://twitter.com/${data.site.user.username}`
              : `https://github.com/${data.site?.user?.gh_username}`
          }
          rel="noreferrer"
          target="_blank"
        >
          <div className="my-8">
            <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden inline-block align-middle">
              {data.site?.user?.image ? (
                <BlurImage
                  alt={data.site?.user?.name ?? "User Avatar"}
                  height={80}
                  src={data.site.user.image}
                  width={80}
                />
              ) : (
                <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
                  ?
                </div>
              )}
            </div>
            <div className="inline-block text-md md:text-lg align-middle ml-3">
              by <span className="font-semibold">{data.site?.user?.name}</span>
            </div>
          </div>
        </a>
      </div>

      {/* Thumb Image */}
      <div className="relative h-80 md:h-150 w-full max-w-screen-lg lg:w-2/3 md:w-5/6 m-auto mb-10 md:mb-20 md:rounded-2xl overflow-hidden">
        {data.image ? (
          <BlurImage
            alt={data.title ?? "Post image"}
            width={1200}
            height={630}
            className="w-full h-full object-cover"
            placeholder="blur"
            blurDataURL={data.imageBlurhash || placeholderBlurhash}
            src={data.image}
          />
        ) : (
          <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
            ?
          </div>
        )}
      </div>

      {/* Article Content */}
      <article className="w-11/12 sm:w-3/4 m-auto prose prose-md sm:prose-lg">
        {/* {data.content.map(serialize)} */}
        <pre>{JSON.stringify(data.content)}</pre>
      </article>

      {/* Читайте також */}
      {adjacentPosts.length > 0 && (
        <div className="relative mt-10 sm:mt-20 mb-20">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">
              Читайте також
            </span>
          </div>
        </div>
      )}

      {adjacentPosts && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 mx-5 lg:mx-12 2xl:mx-auto mb-20 max-w-screen-xl">
          {adjacentPosts.map((data, index) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )}
    </div>

  );
}
