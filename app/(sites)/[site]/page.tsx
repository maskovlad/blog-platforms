import BlurImage from "@/components/BlurImage";
import BlogCard from "@/components/BlogCard";
import prisma from "@/lib/prisma";
import type { _SiteData } from "@/types";
import { placeholderBlurhash } from "@/lib/util";
import { getSiteData } from "@/lib/fetchers";
import Link from "next/link";
import styles from "./page.module.css"

//^ USER'S SITE INDEX PAGE

export async function generateStaticParams() {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      where: {
        NOT: {
          customDomain: null,
        },
      },
      select: {
        customDomain: true,
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;
  // console.log({ allPaths })
  return allPaths.map((path) => ({
    site: path,
  }));
}

export default async function Page({ params }: { params: { site: string } }) {
  const { site } = params;

  const data = await getSiteData(site);

  return (
    <article className={styles.article}>
      {data.posts.length > 0 ? (
        <div>
          <Link href={`/${data.posts[0].slug}`}>
            <div className={styles.image_wrapper}>
              {data.posts[0].image ? (
                <BlurImage
                  alt={data.posts[0].title ?? ""}
                  blurDataURL={
                    data.posts[0].imageBlurhash ?? placeholderBlurhash
                  }
                  className={styles.image}
                  width={1300}
                  height={630}
                  placeholder="blur"
                  src={data.posts[0].image}
                />
              ) : (
                <div className={styles.image_plh}>
                  ?
                </div>
              )}
            </div>
            <div className={styles.post0_wrapper}>
              <h2 className={styles.post0_title}>
                {data.posts[0].title}
              </h2>
              <p className={styles.post0_description}>
                {data.posts[0].description}
              </p>
              <div className={styles.post0_avatar}>
                <div className={styles.post0_avatar__image_wrapper}>
                  {data.user?.image ? (
                    <BlurImage
                      alt={data.user?.name ?? "User Avatar"}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      src={data.user?.image}
                    />
                  ) : (
                    <div style={{
                        display: "flex",
                        position: "absolute",
                        backgroundColor: "var(--c-white)",
                        color: "var(--c-grey)",
                        fontSize: "2.25rem",
                        lineHeight: "2.5rem",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        userSelect: "none",
                    }}>
                      ?
                    </div>
                  )}
                </div>
                <p className={styles.post0_username}>
                  {data.user?.name}
                </p>
                <div style={{
                  height: "1.5rem",
                  borderLeftWidth: "1px",
                  borderColor: "var(--c-darkgrey)",
                }} />
                <p className={styles.post0_date}>
                  {data.createdAt.toLocaleDateString("uk-UK", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div style={{
            display: "flex",
            paddingTop: "5rem",
            paddingBottom: "5rem",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
          <BlurImage
            src="/empty-state.png"
            alt="No Posts"
            width={613}
            height={420}
            placeholder="blur"
            blurDataURL={placeholderBlurhash}
          />
          <p style={{
              color: "var(--c-darkgrey)",
              fontSize: "1.5rem",
              lineHeight: "2rem",
          }}>Ще немає постів.</p>
        </div>
      )}


      {data.posts.length > 1 && (
        <div className={styles.other_posts}>
          <h2>
            Більше дописів:
          </h2>
          <div className={styles.blogcard_container}>
            {data.posts.slice(1).map((metadata, index) => (
              <BlogCard key={index} data={metadata} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

