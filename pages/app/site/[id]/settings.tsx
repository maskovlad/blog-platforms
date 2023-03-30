import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";

import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import DomainCard from "@/components/app/DomainCard";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import Modal from "@/components/Modal";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Site } from "@prisma/client";
import { placeholderBlurhash } from '@/lib/util';
import { css } from '@emotion/css';
import { Hint } from "@/components/app/Hint";

interface SettingsData
  extends Pick<
    Site,
    | "id"
    | "name"
    | "description"
    | "font"
    | "subdomain"
    | "customDomain"
    | "image"
    | "imageBlurhash"
  > { }

export default function SiteSettings() {
  const router = useRouter();
  const { id } = router.query;
  const siteId = id;

  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSite, setDeletingSite] = useState(false);

  // стейт настройок
  const [data, setData] = useState<SettingsData>({
    id: "",
    name: null,
    description: null,
    font: "font-cal",
    subdomain: null,
    customDomain: null,
    image: null,
    imageBlurhash: null,
  });

  // оновлення даних через useSWR
  const { data: settings } = useSWR<Site | null>(
    siteId && `/api/site?siteId=${siteId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    }
  );

  // оновлення стейту настройок
  useEffect(() => {
    if (settings) setData(settings);
  }, [settings]);

  // збереження настройок
  async function saveSiteSettings(data: SettingsData) {
    setSaving(true);

    try {
      const response = await fetch("/api/site", {
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentSubdomain: settings?.subdomain ?? undefined,
          ...data,
          id: siteId,
        }),
      });

      if (response.ok) {
        setSaving(false);
        mutate(`/api/site?siteId=${siteId}`);
        toast.success(`Changes Saved`);
      }
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  // видалення сайту
  async function deleteSite(siteId: string) {
    setDeletingSite(true);

    try {
      const response = await fetch(`/api/site?siteId=${siteId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingSite(false);
    }
  }

  const [debouncedSubdomain] = useDebounce(data?.subdomain, 1500);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  // перевірка доступності субдомену
  useEffect(() => {
    async function checkSubdomain() {
      try {
        const response = await fetch(
          `/api/domain/check?domain=${debouncedSubdomain}&subdomain=1`
        );

        const available = await response.json();

        setSubdomainError(
          available ? null : `${debouncedSubdomain}.vercel.pub`
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (
      debouncedSubdomain !== settings?.subdomain &&
      debouncedSubdomain &&
      debouncedSubdomain?.length > 0
    )
      checkSubdomain();
  }, [debouncedSubdomain, settings?.subdomain]);

  // додавання власного домену
  async function handleCustomDomain() {
    const customDomain = data.customDomain;

    setAdding(true);

    try {
      const response = await fetch(
        `/api/domain?domain=${customDomain}&siteId=${siteId}`,
        {
          method: HttpMethod.POST,
        }
      );

      if (!response.ok)
        throw {
          code: response.status,
          domain: customDomain,
        };
      setError(null);
      mutate(`/api/site?siteId=${siteId}`);
    } catch (error) {
      setError(error);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Layout>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
        }}
      />

      <div className={css`
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
      `}>

        <h1 className={css`
          margin-bottom: 3rem; 
          font-size: 3rem;
          line-height: 1; 
        `}>
          Настройки сайту</h1>

        <div className={css`
          display: flex; 
          margin-bottom: 7rem; 
          margin-top: 3rem; 
          flex-direction: column; 
        `}>
          <div className={css`
            display: flex; 
            margin-top: 1.5rem; 
            flex-direction: column; 
          `}>
            <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
              Назва</h2>
            <div className={css`
              display: flex; 
              overflow: hidden; 
              align-items: center; 
              max-width: 32rem; 
              border-radius: 0.5rem; 
              border-width: 1px; 
              border-color: #374151; 
            `}>
              <input
                className={css`
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem; 
                  padding-left: 1.25rem;
                  padding-right: 1.25rem; 
                  background-color: #ffffff; 
                  color: #374151; 
                  width: 100%; 
                  border-radius: 0; 
                  border-style: none; 

                  :focus {
                    outline: none;
                `}
                name="name"
                onInput={(e) =>
                  setData((data) => ({
                    ...data,
                    name: (e.target as HTMLTextAreaElement).value,
                  }))
                }
                placeholder="Без назви"
                type="text"
                value={data.name || ""}
              />
            </div>
          </div>

          <div className={css`
            display: flex; 
            margin-top: 1.5rem; 
            flex-direction: column; 
          `}>
            <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
              Опис</h2>
            <div className={css`
              display: flex; 
              overflow: hidden; 
              align-items: center; 
              max-width: 32rem; 
              border-radius: 0.5rem; 
              border-width: 1px; 
              border-color: #374151; `}>
              <textarea
                className={css`
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem; 
                  padding-left: 1.25rem;
                  padding-right: 1.25rem; 
                  background-color: #ffffff; 
                  color: #374151; 
                  width: 100%; 
                  border-radius: 0; 
                  border-style: none; 

                  :focus {
                    outline: none;
                `}
                name="description"
                onInput={(e) =>
                  setData((data) => ({
                    ...data,
                    description: (e.target as HTMLTextAreaElement).value,
                  }))
                }
                placeholder="Немає опису"
                rows={3}
                value={data?.description || ""}
              />
            </div>
          </div>

          <div className={css`
            display: flex; 
            margin-top: 1.5rem; 
            flex-direction: column; `}>
            <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
              Шрифт</h2>
            <div className={css`
              display: flex; 
              overflow: hidden; 
              align-items: center; 
              max-width: 32rem; 
              border-radius: 0.5rem; 
              border-width: 1px; 
              border-color: #374151; 
            `}>
              <select
                onChange={(e) =>
                  setData((data) => ({
                    ...data,
                    font: (e.target as HTMLSelectElement).value,
                  }))
                }
                value={data?.font || "font-cal"}
                className={css`
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem; 
                  padding-left: 1.25rem;
                  padding-right: 1.25rem; 
                  background-color: #ffffff; 
                  color: #374151; 
                  width: 100%; 
                  border-radius: 0; 
                  border-style: none; 
                `}>
                <option value="font-cal">Cal Sans</option>
                <option value="font-lora">Lora</option>
                <option value="font-work">Work Sans</option>
              </select>
            </div>
          </div>

          <div className={css`
            display: flex; 
            margin-top: 1.5rem; 
            flex-direction: column; 
          `}>
            <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
              Субдомен</h2>
            <div className={css`
              display: flex; 
              align-items: center; 
              max-width: 32rem; 
              border-radius: 0.5rem; 
              border-width: 1px; 
              border-color: #374151; 
            `}>
              <input
                className={css`
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem; 
                  padding-left: 1.25rem;
                  padding-right: 1.25rem; 
                  background-color: #ffffff; 
                  color: #374151; 
                  width: 50%; 
                  border-radius: 0; 
                  border-top-left-radius: 0.5rem;
                  border-bottom-left-radius: 0.5rem; 
                  border-style: none;                 

                  :focus {
                    outline: none;
               `}
                name="subdomain"
                onInput={(e) =>
                  setData((data) => ({
                    ...data,
                    subdomain: (e.target as HTMLTextAreaElement).value,
                  }))
                }
                placeholder="subdomain"
                type="text"
                value={data.subdomain || ""}
              />
              <div className={css`
                display: flex; 
                background-color: #F3F4F6; 
                justify-content: center; 
                align-items: center; 
                width: 50%; 
                height: 3rem; 
                border-top-right-radius: 0.5rem;
                border-bottom-right-radius: 0.5rem; 
                border-left-width: 1px; 
                border-color: #4B5563; 
              `}>
                sviy.site
              </div>
            </div>
            {subdomainError && (
              <p className={css`
                padding-left: 1.25rem;
                padding-right: 1.25rem; 
                color: #EF4444; 
                text-align: left; 
              `}>
                <b>{subdomainError}</b> зайнято. Виберіть будь ласка інший субдомен.
              </p>
            )}
          </div>
          
          <div className={css`
            display: flex; 
            margin-top: 1.5rem; 
            flex-direction: column; `}>
            <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
              Власний домен</h2>
            {settings?.customDomain ? (
              <DomainCard data={data} />
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleCustomDomain();
                }}
                className={css`
                  display: flex; 
                  justify-content: flex-start; 
                  align-items: center; 
                  max-width: 32rem; 
                `}>
                <div className={css`
                  overflow: hidden; 
                  flex: 1 1 auto; 
                  border-radius: 0.5rem; 
                  border-width: 1px; 
                  border-color: #374151; `}>
                  <input
                    autoComplete="off"
                    className={css`padding-top: 0.75rem;
                        padding-bottom: 0.75rem; 
                        padding-left: 1.25rem;
                        padding-right: 1.25rem; 
                        background-color: #ffffff; 
                        color: #374151; 
                        width: 100%; 
                        border-radius: 0; 
                        border-style: none; 

                        :focus {
                          outline: none;
                        }
                      `}
                    name="customDomain"
                    onInput={(e) => {
                      setData((data) => ({
                        ...data,
                        customDomain: (e.target as HTMLTextAreaElement).value,
                      }));
                    }}
                    pattern="^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
                    placeholder="mydomain.com"
                    value={data.customDomain || ""}
                    type="text"
                  />
                </div>
                <button
                  type="submit"
                  className={css`
                    margin-left: 1rem;
                    padding: 0.75rem 1.25rem; 
                    background-color: #3258d9; 
                    transition-property: all; 
                    transition-duration: 150ms; 
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
                    color: #ffffff; 
                    border-radius: 0.375rem; 
                    border-width: 1px; 
                    border-color: #3258d9; 
                    border-style: solid; 

                    :hover {
                    background-color: #ffffff; 
                    color: #3258d9; 
                  }`}>
                  {adding ? <LoadingDots /> : "Додати"}
                </button>
              </form>
            )}
            {error && (
              <div className={css`
                display: flex; 
                margin-top: 1.25rem; 
                margin-left: 0.5rem; 
                color: #EF4444; 
                font-size: 0.875rem;
                line-height: 1.25rem; 
                text-align: left; 
                align-items: center; 
                width: 100%; 
                max-width: 42rem; `}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  shapeRendering="geometricPrecision"
                  style={{ color: "#f44336" }}>
                  <circle cx="12" cy="12" r="10" fill="white" />
                  <path d="M12 8v4" stroke="#f44336" />
                  <path d="M12 16h.01" stroke="#f44336" />
                </svg>
                {error.code == 403 ? (
                  <p>
                    <b>{error.domain}</b> - це ім&apos;я зайнято, спробуйте, будь ласка інше, або запросіть делегування.
                    <button
                      className={css`margin-left: 0.25rem; `}
                      onClick={async (e) => {
                        e.preventDefault();
                        await fetch(
                          `/api/request-delegation?domain=${error.domain}`
                        ).then((res) => {
                          if (res.ok) {
                            toast.success(
                              `Запросіть делегування для ${error.domain}. Спробуйте додати домен за кілька хвилин.`
                            );
                          } else {
                            alert(
                              "Помилка запросу на делегування.Спробуйте, будь ласка пізніше."
                            );
                          }
                        });
                      }}>
                      <u>Натисніть тут для запросу.</u>
                    </button>
                  </p>
                ) : (
                  <p>
                    Неможливо додати <b>{error.domain}</b>, тому що він пов'язаний з іншим проєктом.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={`
            display: flex; 
            position: relative; 
            margin-top: 1.5rem; 
            flex-direction: column; 
          `}>
            <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
              Зображення сайту{" "}
              <Hint text="Imagetest" />
              </h2>
            <div
              className={css`
                position: relative;
                margin-top: 1.25rem;
                width: 100%;
                border-radius: 0.375rem;
                border-width: 2px;
                border-color: #1F2937;
                border-style: dashed; 
                ${data.image 
                  ? "" 
                  : "background-color:#D1D5DB;animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;@keyframes pulse {0%,100%{opacity: 1;}50%{opacity:0.5;}};"
                }
                `}>
              <CloudinaryUploadWidget
                callback={(e) =>
                  setData({
                    ...data,
                    image: e.secure_url,
                  })
                }>
                {({ open }) => (
                  <button
                    onClick={open}
                    className={css`
                      display: flex; 
                      position: absolute; 
                      z-index: 10; 
                      background-color: #E5E7EB; 
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
                      }`}>
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

              {data.image && (
                <BlurImage
                  alt="Cover Photo"
                  blurDataURL={data.imageBlurhash || placeholderBlurhash}
                  className={css`
                    object-fit: cover; 
                    width: 100%; 
                    border-radius: 0.375rem; `}
                  height={500}
                  placeholder="blur"
                  src={data.image}
                  width={800}
                />
              )}
            </div>
            <div className={css`width: 100%; height: 2.5rem;`} />
            <div className={css`
              display: flex; 
              margin-top: 1.5rem; 
              flex-direction: column; 
              max-width: 32rem; `}>
              <h2 className={css`
              font-size: 1.5rem;
              line-height: 2rem; 
            `}>
                Видалення сайту</h2>
              <p>
                Назавжди видалити ваш сайт і весь його вміст. Цю дію неможливо відмінити – будьте обережні.
              </p>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                className={css`
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem; 
                  padding-left: 1.25rem;
                  padding-right: 1.25rem; 
                  background-color: #EF4444; 
                  transition-property: all; 
                  transition-duration: 150ms; 
                  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
                  color: #ffffff; 
                  max-width: max-content; 
                  border-radius: 0.375rem; 
                  border-width: 1px; 
                  border-color: #EF4444; 
                  border-style: solid; 

                  :focus {
                    outline:none;
                  }
                  :hover {
                  background-color: #ffffff; 
                  color: #EF4444; 
                  }`}>
                Видалити
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await deleteSite(siteId as string);
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
            `}>
          <h2 className={css`
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            line-height: 2rem;
          `}>
            Видалення сайту</h2>
          <div className={css`
                display: grid;
                margin-left: auto;
                margin-right: auto;
                width: 83.333333%;
                row-gap: 1.25rem;
              `}>
            <p className={css`
              margin-bottom: 0.75rem;
              color: #4B5563;
            `}>
              Ви впевнені, що бажаєте видалити свій сайт? Ця дія незворотня. Введіть повне ім&apos;я вашого сайту (<b>{data.name}</b>
              ) для підтвердження.
            </p>
            <div className={css`
              display: flex; 
              overflow: hidden; 
              align-items: center; 
              border-radius: 0.5rem; 
              border-width: 1px; 
              border-color: #374151; `}>
              <input
                className={css`
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem; 
                  padding-left: 1.25rem;
                  padding-right: 1.25rem; 
                  background-color: #ffffff; 
                  color: #374151; 
                  color: #9CA3AF; 
                  width: 100%; 
                  border-radius: 0; 
                  border-top-right-radius: 0.5rem;
                  border-bottom-right-radius: 0.5rem; 
                  border-style: none;
                  
                  :focus {
                    outline: none;
                  }
                  `}
                type="text"
                name="name"
                placeholder={data.name ?? ""}
                pattern={data.name ?? "Site Name"}
              />
            </div>
          </div>

          <div className={css`
                display: flex;
                margin-top: 2.5rem;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              `}>
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
                  border-color: #d1d5db;

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
              onClick={() => setShowDeleteModal(false)}>
              ВІДМІНА
            </button>

            <button
              type="submit"
              disabled={deletingSite}
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
                  border-color: #d1d5db;
                  :focus-visible {
                    box-shadow: 0 0 3px 1px #ef4444;
                  }
                  :focus {
                    outline: none;
                  }
                  ${deletingSite
                  ? "background-color: #F9FAFB;color: #9CA3AF;cursor: not-allowed;"
                  : "background-color: #ffffff;color: #ef4444;:hover {color: #000000;}"}
                `}>
              {deletingSite ? <LoadingDots /> : "ВИДАЛИТИ"}
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
          `}>
        <div className={css`
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
            `}>
          <button
            onClick={() => {
              saveSiteSettings(data);
            }}
            disabled={saving || subdomainError !== null}
            className={css`
                margin-left: 0.5rem;
                margin-right: 0.5rem;
                transition-property: all;
                transition-duration: 150ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                color: #ffffff;
                height: 2.5rem;
                padding-left: 1rem;
                padding-right: 1rem; 
                border-width: 2px;
                ${saving || subdomainError
                ? "background-color: #D1D5DB;border-color: #D1D5DB;cursor: not-allowed;"
                : "background-color: #42cc00;border-color: #42cc00;:hover {background-color: #ffffff;color:#42cc00;}"
              }
              `}>
            {saving ? <LoadingDots /> : "Зберегти зміни"}
          </button>
        </div>
      </footer>
    </Layout>
  );
}
