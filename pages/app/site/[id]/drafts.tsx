import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";

import BlurImage from "@/components/BlurImage";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Post, Site } from "@prisma/client";
import { css } from '@emotion/css';
import { CardLoader, CardPlaceholder } from "@/components/CardPlaceholderLoader";

interface SitePostData {
  posts: Array<Post>;
  site: Site | null;
}

export default function SiteDrafts() {
  const [creatingPost, setCreatingPost] = useState(false);

  const router = useRouter();
  const { id: siteId } = router.query;

  //оновлення даних через useSWR
  const { data } = useSWR<SitePostData>(
    siteId && `/api/post?siteId=${siteId}&published=false`,
    fetcher,
    {
      onSuccess: (data) => !data?.site && router.push("/"),
    }
  );

  // створення посту
  async function createPost(siteId: string) {
    try {
      const res = await fetch(`/api/post?siteId=${siteId}`, {
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/post/${data.postId}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <div
        className={css`
        padding-left: 1.5rem;
        padding-right: 1.5rem; 
        padding-top: 5rem;
        padding-bottom: 5rem; 
        margin-left: auto;
        margin-right: auto; 
        max-width: 1280px; 

        @media (min-width: 412px) { 
          padding-left: 2.5rem;
          padding-right: 2.5rem;

        @media (min-width: 640px) { 
          padding-left: 5rem;
          padding-right: 5rem; 
        }
      `}
      >
        <div
          className={css`
            display: flex;
            margin-top: 1.25rem;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            @media (min-width: 640px) {
              margin-top: 0;
              flex-direction: row;
            }
          `}
        >
          <h1
            className={css`
              font-size: 3rem;
            `}
          >
            {" "}
            Чернетки для {data ? data?.site?.name : "..."}
          </h1>

          <button
            onClick={() => {
              setCreatingPost(true);
              createPost(siteId as string);
            }}
            className={css`
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
              padding-left: 1rem;
              padding-right: 1rem;
              transition-property: all;
              transition-duration: 150ms;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              font-size: 1.125rem;
              line-height: 1.75rem;
              letter-spacing: 0.025em;
              width: 75%;
              border-width: 2px;
              border-radius: 5px;
              cursor: pointer;

              @media (min-width: 640px) {
                width: 13rem;
              }

              ${creatingPost
                ? "background-color: var(--c-lightgrey);border-color: var(--c-lightgrey);cursor: not-allowed;"
                : "background-color: var(--c-green);color: #ffffff;border-color: var(--c-green);:hover {background-color: #ffffff;color: var(--c-green);}"}
            `}
          >
            {creatingPost ? (
              <LoadingDots />
            ) : (
              <>
                Нова Чернетка
                <span
                  className={css`
                    margin-left: 1rem;
                  `}
                >
                  ＋
                </span>
              </>
            )}
          </button>
        </div>

        <div
          className={css`
            display: grid;
            margin-top: 2.5rem;
            margin-bottom: 2.5rem;
            row-gap: 2.5rem;
          `}
        >
          {/* список постів */}
          {data ? (
            data.posts.length > 0 ? (
              data.posts.map((post) => (
                <div
                  key={post.id}
                  className={css`
                    display: flex;
                    overflow: hidden;
                    flex-direction: column;
                    border-radius: 0.5rem;
                    border-width: 1px;
                    border-color: var(--c-lightgrey2);

                    @media (min-width: 768px) {
                      flex-direction: row;
                    }
                  `}
                >
                  <div
                    className={css`
                      position: relative;
                      width: 100%;
                      height: 15.75rem;

                      @media (min-width: 768px) {
                        flex: none;
                        width: 33%;
                      }
                    `}
                  >
                    <Link href={`/post/${post.id}`}>
                      {post.image ? (
                        <BlurImage
                          alt={post.title ?? "Unknown Thumbnail"}
                          fill
                          sizes="(min-width: 768px) 100vw, 33vw"
                          className={css`
                            object-fit: cover;
                            height: 100%;
                          `}
                          src={post.image}
                        />
                      ) : (
                        <div
                          className={css`
                            display: flex;
                            position: absolute;
                            background-color: var(--c-white);
                            color: var(--c-grey);
                            font-size: 2.25rem;
                            line-height: 2.5rem;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                          `}
                        >
                          ?
                        </div>
                      )}
                    </Link>
                  </div>

                  <div
                    className={css`
                      position: relative;
                      padding: 2.5rem;
                    `}
                  >
                    <Link href={`/post/${post.id}`}>
                      <h2
                        className={css`
                          font-size: 1.875rem;
                          line-height: 2.25rem;
                        `}
                      >
                        {post.title}
                      </h2>
                    </Link>
                    <p
                      className={css`
                        margin-top: 1.25rem;
                        margin-bottom: 1.25rem;
                        font-size: 1rem;
                        line-height: 1.5rem;
                      `}
                    >
                      {post.description}
                    </p>
                    <a
                      className={css`
                        position: absolute;
                        bottom: 1.25rem;
                        left: 2.5rem;
                        padding-top: 0.25rem;
                        padding-bottom: 0.25rem;
                        padding-left: 0.75rem;
                        padding-right: 0.75rem;
                        background-color: var(--c-lightgrey2);
                        color: var(--c-darkgrey);
                        letter-spacing: 0.025em;
                        white-space: nowrap;
                        border-radius: 0.25rem;
                      `}
                      href={`${process.env.NEXT_PUBLIC_SITE_PROTOCOL}${data.site?.subdomain}.${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Переглянути ↗
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <>
                <CardPlaceholder />
                <div
                  className={css`
                    text-align: center;
                  `}
                >
                  <p
                    className={css`
                      color: var(--c-darkgrey);
                      font-size: 1.5rem;
                      line-height: 2rem;
                    `}
                  >
                    Ви ще не маєте постів. Натисніть &quot;Новий Пост&quot; щоб
                    додати його.
                  </p>
                </div>
              </>
            )
          ) : (
            <CardLoader />
          )}
        </div>
      </div>
    </Layout>
  );
}
