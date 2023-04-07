import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { css, cx } from "@emotion/css";

import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSitePost } from "@/types";

import { Descendant } from "slate";
import SviyEditor from "@/components/editor/SviyEditor";
import Head from "next/head";

interface PostData {
  title: string;
  description: string;
  content: Descendant[] | null;
}

export default function Post() {
  const router = useRouter();

  // TODO: Undefined check redirects to error
  const { id: postId } = router.query;

  // отримання даних
  const { data: post, isValidating } = useSWR<WithSitePost>(
    router.isReady && `/api/post?postId=${postId}`,
    fetcher,
    {
      dedupingInterval: 1000,
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    }
  );

  const [publishing, setPublishing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // рядок стану
  const [savedState, setSavedState] = useState(
    post
      ? `Збереження ${Intl.DateTimeFormat("uk", { month: "short" }).format(
          new Date(post.updatedAt)
        )} ${Intl.DateTimeFormat("uk", { day: "2-digit" }).format(
          new Date(post.updatedAt)
        )} ${Intl.DateTimeFormat("uk", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(post.updatedAt))}`
      : "Зберігаю..."
  );

  // стейт для всіх даних посту
  const [data, setData] = useState<PostData>({
    title: "",
    description: "",
    content: null,
  });

  // оновлення даних з кешу useSWR
  useEffect(() => {
    if (post)
      // from useSWR
      setData({
        title: post.title ?? "",
        description: post.description ?? "",
        content: post.content as Descendant[], //? не знаю чи правильно "as Descendant[]"
      });
  }, [post]);

  // збереження
  const saveChanges = useCallback(
    async (data: PostData) => {
      setSavedState("Зберігаю...");

      try {
        const response = await fetch("/api/post", {
          method: HttpMethod.PUT,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: postId,
            title: data.title,
            description: data.description,
            content: data.content,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setSavedState(
            `Збережено ${Intl.DateTimeFormat("uk", { month: "short" }).format(
              new Date(responseData.updatedAt)
            )} ${Intl.DateTimeFormat("uk", { day: "2-digit" }).format(
              new Date(responseData.updatedAt)
            )} at ${Intl.DateTimeFormat("uk", {
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(responseData.updatedAt))}`
          );
        } else {
          setSavedState("Failed to save.");
          toast.error("Failed to save");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [postId]
  );

  // усунення дрязгу
  const [debouncedData] = useDebounce(data, 1000);
  useEffect(() => {
    if (debouncedData.title) saveChanges(debouncedData);
  }, [debouncedData, saveChanges]);

  // стан кнопки публікування
  useEffect(() => {
    if (data.title && data.description && data.content && !publishing)
      setDisabled(false);
    else setDisabled(true);
  }, [publishing, data]);

  // збереження по Ctrl+s
  useEffect(() => {
    function clickedSave(e: KeyboardEvent) {
      let charCode = String.fromCharCode(e.which).toLowerCase();

      if ((e.ctrlKey || e.metaKey) && charCode === "s") {
        e.preventDefault();
        saveChanges(data);
      }
    }

    window.addEventListener("keydown", clickedSave);

    return () => window.removeEventListener("keydown", clickedSave);
  }, [data, saveChanges]);

  // публікування
  async function publish() {
    setPublishing(true);

    try {
      const response = await fetch(`/api/post`, {
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          title: data.title,
          description: data.description,
          content: data.content,
          published: true,
          subdomain: post?.site?.subdomain,
          customDomain: post?.site?.customDomain,
          slug: post?.slug,
        }),
      });

      if (response.ok) {
        mutate(`/api/post?postId=${postId}`);
        router.push(
          `${process.env.NEXT_PUBLIC_SITE_PROTOCOL}${post?.site?.subdomain}.${process.env.NEXT_PUBLIC_SITE_URL}/${post?.slug}`
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPublishing(false);
    }
  }

  const onChange = (content: Descendant[]) => {
    setData({ ...data, content });
  };

  // лоадер
  if (isValidating)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Layout siteId={post?.site?.id}>
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
          <button
            onClick={async () => {
              await publish();
            }}
            title={
              disabled
                ? "Пост повинен мати заголовок, опис і контент."
                : "Публікувати"
            }
            disabled={disabled}
            className={css`
              position: absolute;
              top: -8.5rem;
              right: 3rem;
              padding-left: 1rem;
              padding-right: 1rem;
              transition-property: all;
              transition-duration: 150ms;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              color: #ffffff;
              height: 2.5rem;
              border-width: 2px;
              border-radius: 5px;

              background-color: ${disabled ? "#D1D5DB" : "var(--color-green)"};
              border-color: ${disabled ? "#D1D5DB" : "var(--color-green)"};
              cursor: ${disabled ? "not-allowed" : "pointer"};

              :hover {
                background-color: #ffffff;
                color: var(--color-green);
              }
            `}
          >
            {publishing ? <LoadingDots /> : "Публікувати  →"}
          </button>

          <TextareaAutosize
            name="title"
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setData({
                ...data,
                title: (e.target as HTMLTextAreaElement).value,
              })
            }
            className={css`
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              padding-top: 1rem;
              padding-bottom: 1rem;
              margin-top: 1.5rem;
              color: #1f2937;
              font-size: 3rem;
              line-height: 1;
              width: 100%;
              border-style: none;
              resize: none;

              :focus {
                outline: none;
              }

              @media (max-width: 640px) {
                font-size: 2rem;
              }
            `}
            placeholder="Заголовок посту"
            value={data.title}
          />

          <TextareaAutosize
            name="description"
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setData({
                ...data,
                description: (e.target as HTMLTextAreaElement).value,
              })
            }
            className={css`
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              padding-top: 0.75rem;
              padding-bottom: 0.75rem;
              margin-bottom: 0.75rem;
              color: #1f2937;
              font-size: 1.25rem;
              line-height: 1.75rem;
              width: 100%;
              border-style: none;
              resize: none;

              :focus {
                outline: none;
              }
            `}
            placeholder="Опис вашого посту"
            value={data.description}
          />

          {data?.content && (
            <SviyEditor
              content={data.content as Descendant[]}
              onChange={onChange}
            />
          )}
        </div>

        <footer
          className={css`
            position: fixed;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: #ffffff;
            height: 2rem;
            border-top-width: 1px;
            border-color: #d6d6d6;
            border-style: solid;
          `}
        >
          <div
            className={css`
              display: flex;
              padding-left: 2.5rem;
              padding-right: 2.5rem;
              margin-left: auto;
              margin-right: auto;
              justify-content: flex-end;
              align-items: center;
              max-width: 1280px;
              height: 100%;
              font-size: 0.875rem;
              line-height: 1.25rem;

              @media (min-width: 640px) {
                padding-left: 5rem;
                padding-right: 5rem;
              }
            `}
          >
            <div
              className={css`
                font-size: 0.875rem;
                line-height: 1.25rem;
                width: 300px;
              `}
            >
              <strong>{post?.published ? "Опубліковано" : "Чернетка"}</strong> |{" "}
              {savedState}
            </div>
          </div>
        </footer>
      </Layout>
    </>
  );
}
