import BlogCard from "@/components/BlogCard";
import BlurImage from "@/components/BlurImage";
import prisma from "@/lib/prisma";
import { Text } from 'slate'
import Highlight from 'react-highlight'
import type { AdjacentPost, Meta, _SiteSlugData } from "@/types";
import { placeholderBlurhash } from "@/lib/util";
import { getPostData } from "@/lib/fetchers";
import styles from "./page.module.css"

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

    <>
      {/* Заголовок посту - title, description, date, author */}
      <section className={styles.info}>
        <div className={styles.meta}>
          <p className={styles.date}>
            {data.createdAt.toLocaleDateString("uk-UK", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1>
            {data.title}
          </h1>
          <p className={styles.description}>
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
          <div className={styles.author}>
            <div className={styles.image_wrapper}>
              {data.site?.user?.image ? (
                <BlurImage
                  alt={data.site?.user?.name ?? "User Avatar"}
                  src={data.site.user.image}
                  height={80}
                  width={80}
                  className={styles.author__image}
                />
              ) : (
                <div className={styles.image_plh}>
                  ?
                </div>
              )}
            </div>
            <div className={styles.author__name}>
              by <span style={{ fontWeight: "600" }}>{data.site?.user?.name}</span>
            </div>
          </div>
        </a>
      </section>

      {/* Thumb Image */}
      <section className={styles.thumb_wrapper}>
        {data.image ? (
          <BlurImage
            alt={data.title ?? "Post image"}
            width={1200}
            height={630}
            className={styles.thumb}
            placeholder="blur"
            blurDataURL={data.imageBlurhash || placeholderBlurhash}
            src={data.image}
          />
        ) : (
          <div className={styles.image_plh}>
            ?
          </div>
        )}
      </section>

      {/* Article Content */}
      <article className={styles.a_container}>
        {/* {data.content.map(serialize)} */}
        <pre>{JSON.stringify(data.content)}</pre>
      </article>

      {/* Читайте також */}
      {adjacentPosts.length > 0 && (
        <section className={styles.readmore_title}>
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "0",
              right: "0",
              bottom: "0",
              left: "0",
              alignItems: "center",
            }}
            aria-hidden="true"
          >
            <div style={{
              width: "100%",
              borderTopWidth: "1px",
              borderColor: "var(--c-lightgrey)",
            }} />
          </div>
          <div style={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
          }}>
            <span style={{
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
              backgroundColor: "#ffffff",
              color: "var(--c-grey)",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            }}>
              Читайте також
            </span>
          </div>
        </section>
      )}

      {adjacentPosts && (
        <section className={styles.blogcard_container}>
          {adjacentPosts.map((data, index) => (
            <BlogCard key={index} data={data} />
          ))}
        </section>
      )}
    </>

  );
}


// const serialize = (node) => {
//   console.log({node})
//   if (Text.isText(node)) {
//     if (node.code) {
//       return <Highlight className="h-full">{node.text}</Highlight>
//     }
//     if (node['heading-one']) {
//       return (
//         <h1 className="text-3xl font-mont md:text-6xl mb-10 text-gray-800">
//           {node.text}
//         </h1>
//       )
//     }

//     if (node.bold && node.italic) {
//       return <p className="font-bold italic font-mont">{node.text}</p>
//     }

//     if (node.bold) {
//       return <p className="font-bold font-mont">{node.text}</p>
//     }

//     if (node.italic) {
//       return <p className="font-italic font-mont">{node.text}</p>
//     }

//     if (node['heading-two']) {
//       return <p className="text-2xl font-mont">{node.text}</p>
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

