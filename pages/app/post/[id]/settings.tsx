import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import LoadingDots from "@/components/app/loading-dots";
import Modal from "@/components/Modal";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { ChangeEvent } from "react";

import type { WithSitePost } from "@/types";
import { placeholderBlurhash } from "@/lib/util";
import { css } from '@emotion/css';
import { Hint } from "@/components/app/Hint";

interface SettingsData {
  slug: string;
  id: string;
  image: string;
  imageBlurhash: string;
}

export default function PostSettings() {
  const router = useRouter();

  // TODO: Undefined check redirects to error
  const { id: postId } = router.query;

  // оновлення даних з кешу useSWR
  const { data: settings, isValidating } = useSWR<WithSitePost>(
    `/api/post?postId=${postId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  // стан з настройками
  // todo додати seo
  const [data, setData] = useState<SettingsData>({
    image: settings?.image ?? "",
    imageBlurhash: settings?.imageBlurhash ?? "",
    slug: settings?.slug ?? "",
    id: settings?.id ?? "",
  });

  // відстеження змін настройок
  useEffect(() => {
    if (settings)
      setData({
        slug: settings.slug,
        image: settings.image ?? "",
        imageBlurhash: settings.imageBlurhash ?? "",
        id: settings.id,
      });
  }, [settings]);

  // збереження настройок
  async function savePostSettings(data: SettingsData) {
    setSaving(true);

    try {
      const response = await fetch("/api/post", {
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          slug: data.slug,
          image: data.image,
          imageBlurhash: data.imageBlurhash,
          subdomain: settings?.site?.subdomain,
          customDomain: settings?.site?.customDomain,
        }),
      });

      if (response.ok) toast.success(`Changes Saved`);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  // видалення посту
  async function deletePost(postId: string) {
    setDeletingPost(true);
    try {
      const response = await fetch(`/api/post?postId=${postId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) {
        router.push(`/site/${settings?.site?.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingPost(false);
    }
  }

  // loader
  if (isValidating)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <>
      <Layout siteId={settings?.site?.id}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 10000,
          }}
        />

        <div
          className={css`
            padding-left: 2.5rem;
            padding-right: 2.5rem;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 4rem;
            margin-top: 5rem;
            max-width: 1280px;

            @media (min-width: 640px) {
              padding-left: 5rem;
              padding-right: 5rem;
            }
          `}
        >
          <h1
            className={css`
              margin-bottom: 3rem;
              font-size: 3rem;
              line-height: 1;
            `}
          >
            Настройки посту
          </h1>
          <div
            className={css`
              display: flex;
              margin-bottom: 7rem;
              margin-top: 3rem;
              flex-direction: column;
            `}
          >
            <div //* slug
              className={css`
                margin-top: 1.5rem;
              `}
            >
              <h2
                className={css`
                  font-size: 1.5rem;
                  line-height: 2rem;
                  margin-bottom: 1rem;
                `}
              >
                Slug посту{" "}
                <Hint text="Вигляд в адресному рядку браузера - латиниця, цифри, риски" />
              </h2>

              <div
                className={css`
                  display: flex;
                  align-items: center;
                  max-width: 32rem;
                  border-radius: 0.5rem;
                  border-width: 1px;
                  border-color: var(--c-grey);
                `}
              >
                <span
                  className={css`
                    padding-left: 1.25rem;
                    padding-right: 1.25rem;
                    white-space: nowrap;
                    border-top-left-radius: 0.5rem;
                    border-bottom-left-radius: 0.5rem;
                    border-right-width: 1px;
                    border-color: #4b5563;
                  `}
                >
                  {settings?.site?.subdomain}.{process.env.NEXT_PUBLIC_SITE_URL}
                  /
                </span>
                <input
                  className={css`
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    padding-left: 1.25rem;
                    padding-right: 1.25rem;
                    background-color: #ffffff;
                    color: var(--c-grey);
                    width: 100%;
                    border-radius: 0;
                    border-top-right-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    border-style: none;
                  `}
                  type="text"
                  name="slug"
                  placeholder="post-slug"
                  value={data?.slug}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    setData((data) => ({ ...data, slug: e.target.value }))
                  }
                />
              </div>
            </div>

            <div //* thumb
              className={css`
                margin-top: 1.5rem;
              `}
            >
              <h2
                className={css`
                  font-size: 1.5rem;
                  line-height: 2rem;
                `}
              >
                Зображення посту{" "}
                <Hint text="Відображається на картках в списках постів" />
              </h2>
              <div
                // className={`${
                //   data.image ? "" : "animate-pulse bg-gray-300 h-150"
                // } relative mt-5 w-full border-2 border-gray-800 border-dashed rounded-md`}
                className={css`
                  position: relative;
                  margin-top: 1.25rem;
                  width: 400px;
                  border-radius: 0.375rem;
                  border-width: 2px;
                  border-color: #1f2937;
                  border-style: dashed;
                  ${!data.image &&
                  "background-color: var(--c-lightgrey); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;@keyframes pulse {0%, 100% {opacity: 1;}50% {opacity: .5;}}; "}
                `}
              >
                <CloudinaryUploadWidget
                  callback={(e) =>
                    setData({
                      ...data,
                      image: e.secure_url,
                    })
                  }
                >
                  {({ open }) => (
                    <button
                      onClick={open}
                      className={css`
                        display: flex;
                        position: absolute;
                        z-index: 10;
                        background-color: #e5e7eb;
                        transition-property: all;
                        transition-duration: 200ms;
                        transition-timing-function: linear;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        border-radius: 0.375rem;
                        opacity: 0;

                        :hover {
                          opacity: 1;
                        }
                      `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16 16h-3v5h-2v-5h-3l4-4 4 4zm3.479-5.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h3.5v-2h-3.5c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78 3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-3.5v2h3.5c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408z" />
                      </svg>
                      <p>Завантажити інше зображення</p>
                    </button>
                  )}
                </CloudinaryUploadWidget>

                {/*картинка*/}
                {data.image && (
                  <BlurImage
                    src={data.image}
                    alt="Cover Photo"
                    width={800}
                    height={500}
                    placeholder="blur"
                    className={css`
                      object-fit: cover;
                      width: 100%;
                      height: 100%;
                      border-radius: 0.375rem;
                    `}
                    blurDataURL={data.imageBlurhash || placeholderBlurhash}
                  />
                )}
              </div>

              <div // розрив
                className={css`
                  width: 100%;
                  height: 2.5rem;
                `}
              />

              {/* //* видалення посту*/}
              <div
                className={css`
                  display: flex;
                  margin-top: 1.5rem;
                  flex-direction: column;
                  max-width: 32rem;
                  gap: 1.5rem;
                `}
              >
                <h2
                  className={css`
                    font-size: 1.5rem;
                    line-height: 2rem;
                  `}
                >
                  Видалення посту
                </h2>
                <p>
                  Назавжди видалити вашу публікацію та весь її вміст із вашого
                  сайту. Цю дію неможливо відмінити – будьте обережні.
                </p>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                  className={css`
                    padding: 0.75rem 1.25rem;
                    background-color: var(--c-red);
                    transition-property: all;
                    transition-duration: 150ms;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    color: #ffffff;
                    max-width: max-content;
                    border-radius: 0.375rem;
                    border-width: 1px;
                    border-color: var(--c-red);
                    border-style: solid;

                    :hover {
                      background-color: #ffffff;
                      color: var(--c-red);
                    }
                    :focus {
                      outline: none;
                    }
                  `}
                >
                  Видалити Пост
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await deletePost(postId as string);
            }}
            className={css`
              display: inline-block;
              overflow: hidden;
              padding-top: 2rem;
              background-color: #ffffff;
              transition-property: all;
              text-align: center;
              vertical-align: middle;
              width: 100%;
              max-width: 28rem;
              border-radius: 0.5rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
            `}
          >
            <h2
              className={css`
                margin-bottom: 1.5rem;
                font-size: 1.5rem;
                line-height: 2rem;
              `}
            >
              Видалення посту
            </h2>
            <div
              className={css`
                display: grid;
                margin-left: auto;
                margin-right: auto;
                width: 83.333333%;
                row-gap: 1.25rem;
              `}
            >
              <p
                className={css`
                  margin-bottom: 0.75rem;
                  color: #4b5563;
                `}
              >
                Ви впевнені, що хочете видалити свою публікацію? Цю дію не можна
                відмінити.
              </p>
            </div>
            <div
              className={css`
                display: flex;
                margin-top: 2.5rem;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              `}
            >
              <button
                type="button"
                className={css`
                  padding-top: 1.25rem;
                  padding-bottom: 1.25rem;
                  padding-left: 1.25rem;
                  padding-right: 1.25rem;
                  transition-property: all;
                  transition-duration: 150ms;
                  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                  color: #9ca3af;
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  width: 100%;
                  border-bottom-left-radius: 0.25rem;
                  border-top-width: 1px;
                  border-color: var(--c-lightgrey);

                  :focus-visible {
                    box-shadow: 0 0 3px 1px #000000;
                    border-right-width: 1px;
                  }
                  :focus {
                    outline: none;
                  }

                  :hover {
                    color: #000000;
                  }
                `}
                onClick={() => setShowDeleteModal(false)}
              >
                ВІДМІНА
              </button>

              <button
                type="submit"
                disabled={deletingPost}
                className={css`
                  padding-top: 1.25rem;
                  padding-bottom: 1.25rem;
                  padding-left: 1.25rem;
                  padding-right: 1.25rem;
                  transition-property: all;
                  transition-duration: 150ms;
                  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  width: 100%;
                  border-bottom-right-radius: 0.25rem;
                  border-top-width: 1px;
                  border-left-width: 1px;
                  border-color: var(--c-lightgrey);
                  :focus-visible {
                    box-shadow: 0 0 3px 1px var(--c-red);
                  }
                  :focus {
                    outline: none;
                  }
                  ${deletingPost
                    ? "background-color: #F9FAFB;color: #9CA3AF;cursor: not-allowed;"
                    : "background-color: #ffffff;color: var(--c-red);:hover {color: #000000;}"}
                `}
              >
                {deletingPost ? <LoadingDots /> : "ВИДАЛИТИ"}
              </button>
            </div>
          </form>
        </Modal>

        <footer
          className={css`
            position: fixed;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: 20;
            background-color: #ffffff;
            height: 4rem;
            border-top-width: 1px;
            border-color: #6b7280;
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

              @media (min-width: 640px) {
                padding-left: 5rem;
                padding-right: 5rem;
              }
            `}
          >
            <button
              onClick={() => {
                savePostSettings(data);
              }}
              disabled={saving}
              className={css`
                margin-left: 0.5rem;
                margin-right: 0.5rem;
                transition-property: all;
                transition-duration: 150ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                color: #ffffff;
                height: 2.5rem;
                width: 10rem;
                padding-left: 1rem;
                padding-right: 1rem;
                border-width: 2px;
                border-radius: 5px;
                ${saving
                  ? "background-color: var(--c-lightgrey);border-color: var(--c-lightgrey);cursor: not-allowed;"
                  : "background-color: var(--c-green);border-color: var(--c-green);:hover {background-color: #ffffff;color:var(--c-green);}"}
              `}
            >
              {saving ? <LoadingDots /> : "Зберегти зміни"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}

