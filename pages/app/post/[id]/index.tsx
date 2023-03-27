import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";

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
    content: null
  });

  // оновлення даних з кешу useSWR
  useEffect(() => {
    if (post) // from useSWR
      setData({
        title: post.title ?? "",
        description: post.description ?? "",
        content: post.content as Descendant[],   //? не знаю чи правильно "as Descendant[]"
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
    setData({ ...data, content })
  }

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
        <div className="relative max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">

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
            className={`${disabled
              ? "cursor-not-allowed bg-gray-300 border-gray-300"
              : "bg-black hover:bg-white hover:text-black border-black"
              } absolute top-1 right-1 px-4 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
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
            className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Untitled Post"
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
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-400 text-xl mb-3 resize-none border-none focus:outline-none focus:ring-0"
            placeholder="No description provided. Click to edit."
            value={data.description}
          />

          {data?.content && (
            <SviyEditor content={data.content as Descendant[]} onChange={onChange} />
          )}
          {/* <RichTextEditor /> */}
        </div>

        <footer className="h-8 z-5 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
          <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-between items-center">
            <div className="text-sm">
              <strong>
                {post?.published ? "Опубліковано" : "Чорновик"}
              </strong>
              {' '}|{' '}{savedState}
            </div>
          </div>
        </footer>

      </Layout>
    </>
  );
}
