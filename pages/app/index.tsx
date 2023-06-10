import { useState, useEffect, useRef } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import Modal from "@/components/Modal";
import LoadingDots from "@/components/app/loading-dots";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { FormEvent } from "react";
import type { Site } from "@prisma/client";
import { css } from "@emotion/css";
import { CardPlaceholder } from "@/components/CardPlaceholderLoader";
import { CardLoader } from "@/components/CardPlaceholderLoader";

export default function AppIndex() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [creatingSite, setCreatingSite] = useState<boolean>(false);
  const [subdomain, setSubdomain] = useState<string>("");
  const [debouncedSubdomain] = useDebounce(subdomain, 1500);
  const [error, setError] = useState<string | null>(null);

  const siteNameRef = useRef<HTMLInputElement | null>(null);
  const siteSubdomainRef = useRef<HTMLInputElement | null>(null);
  const siteDescriptionRef = useRef<HTMLTextAreaElement | null>(null);

  // * відслідковуєм субдомен, який бажає зареєструвати юзер
  useEffect(() => {
    async function checkSubDomain() {
      if (debouncedSubdomain.length > 0) {
        // перевіряєм доступність такого субдомену для реєстрації
        const response = await fetch(
          `/api/domain/check?domain=${debouncedSubdomain}&subdomain=1`
        );
        const available = await response.json();
        if (available) {
          setError(null);
        } else {
          setError(`${debouncedSubdomain}.${process.env.NEXT_PUBLIC_SITE_URL}`);
        }
      }
    }
    checkSubDomain();
  }, [debouncedSubdomain]);

  const router = useRouter();

  // * сессія юзера
  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  // ^кешування запиту, яке для appDir (maybe) потрібно замінити на функцію cache()
  const { data: sites } = useSWR<Array<Site>>(
    sessionId && `/api/site`,
    fetcher
  );

  async function createSite(e: FormEvent<HTMLFormElement>) {
    const res = await fetch("/api/site", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionId,
        name: siteNameRef.current?.value,
        subdomain: siteSubdomainRef.current?.value,
        description: siteDescriptionRef.current?.value,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/site/${data.siteId}`);
    }
  }

  return (
    <Layout>
      {/* Модалка додавання нового сайту */}
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setCreatingSite(true);
            createSite(event);
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
            Створення нового сайту
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
            <div
              className={css`
                display: flex;
                align-items: center;
                border-radius: 0.5rem;
                border-width: 1px;
                border-color: var(--c-grey);
              `}
            >
              <span
                className={css`
                  padding-right: 0.25rem;
                  padding-left: 1.25rem;
                `}
              >
                📌
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

                  :focus {
                    outline: none;
                  }
                `}
                name="name"
                required
                placeholder="Site Name"
                ref={siteNameRef}
                type="text"
              />
            </div>
            <div
              className={css`
                display: flex;
                align-items: center;
                border-radius: 0.5rem;
                border-width: 1px;
                border-color: var(--c-grey);
              `}
            >
              <span
                className={css`
                  padding-right: 0.25rem;
                  padding-left: 1.25rem;
                `}
              >
                🪧
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
                  border-top-left-radius: 0.5rem;
                  border-bottom-left-radius: 0.5rem;
                  border-style: none;

                  :focus {
                    outline: none;
                  }
                `}
                name="subdomain"
                onInput={() => setSubdomain(siteSubdomainRef.current!.value)}
                placeholder="Subdomain"
                ref={siteSubdomainRef}
                type="text"
              />
              <span
                className={css`
                  display: flex;
                  padding-left: 1.25rem;
                  padding-right: 1.25rem;
                  background-color: var(--c-white);
                  align-items: center;
                  height: 100%;
                  border-top-right-radius: 0.5rem;
                  border-bottom-right-radius: 0.5rem;
                  border-left-width: 1px;
                  border-color: var(--c-darkgrey);
                `}
              >
                .{process.env.NEXT_PUBLIC_SITE_URL}
              </span>
            </div>
            {error && (
              <p
                className={css`
                  padding-left: 1.25rem;
                  padding-right: 1.25rem;
                  color: var(--c-red);
                  text-align: left;
                `}
              >
                <b>{error}</b> вже зайнятий. Спробуйте, будь ласка інший
                субдомен.
              </p>
            )}
            <div
              className={css`
                display: flex;
                border-radius: 0.5rem;
                border-width: 1px;
                border-color: var(--c-grey);
              `}
            >
              <span
                className={css`
                  padding-right: 0.25rem;
                  padding-left: 1.25rem;
                  margin-top: 0.75rem;
                `}
              >
                ✍️
              </span>
              <textarea
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

                  :focus {
                    outline: none;
                  }
                `}
                name="description"
                placeholder="Description"
                ref={siteDescriptionRef}
                required
                rows={3}
              />
            </div>
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
                color: var(--c-darkgrey);
                font-size: 0.875rem;
                line-height: 1.25rem;
                width: 100%;
                border-bottom-left-radius: 0.25rem;
                border-top-width: 1px;
                border-color: var(--c-lightgrey);

                :hover {
                  color: #000000;
                }
                :focus {
                  outline: none;
                }
              `}
              onClick={() => {
                setError(null);
                setShowModal(false);
              }}
            >
              ВІДМІНА
            </button>

            <button
              type="submit"
              disabled={creatingSite || error !== null}
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

                :focus {
                  outline: none;
                }

                ${creatingSite || error
                  ? "background-color: #F9FAFB;color: #9CA3AF;cursor: not-allowed;"
                  : "background-color: #ffffff;color: var(--c-darkgrey);:hover {color: #000000; }"}
              `}
            >
              {creatingSite ? <LoadingDots /> : "СТВОРИТИ"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Список сайтів */}
      <div
        className={css`
          padding-left: 2.5rem;
          padding-right: 2.5rem;
          padding-top: 5rem;
          padding-bottom: 5rem;
          margin-left: auto;
          margin-right: auto;
          max-width: 1280px;

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
            gap:2rem;

            @media (min-width: 640px) {
              margin-top: 0;
              flex-direction: row;
            }
          `}
        >
          <h1
            className={css`
              font-size: 3rem;
              line-height: 1;

              @media (max-width: 640px) {
                font-size: 2rem;
              }
            `}
          >
            Мої сайти
          </h1>
          <button onClick={() => setShowModal(true)} className="btn btn-green">
            Новий Сайт{" "}
            <span
              className={css`
                margin-left: 0.5rem;
              `}
            >
              ＋
            </span>
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
          {sites ? (
            sites.length > 0 ? (
              sites.map((site) => (
                <div
                  key={site.id}
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
                    <Link href={`/site/${site.id}`}>
                      {site.image ? (
                        <BlurImage
                          src={site.image}
                          fill
                          sizes="(min-width: 768px) 100vw,
                              33vw"
                          className={css`
                            object-fit: cover;
                            height: 100%;
                            cursor: pointer;
                          `}
                          alt={site.name ?? "Site thumbnail"}
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
                            user-select: none;
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
                    <Link href={`/site/${site.id}`}>
                      <h2
                        className={css`
                          font-size: 1.875rem;
                          line-height: 2.25rem;
                          cursor: pointer;
                        `}
                      >
                        {site.name}
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
                      {site.description}
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
                      href={`${process.env.NEXT_PUBLIC_SITE_PROTOCOL}${site.subdomain}.${process.env.NEXT_PUBLIC_SITE_URL}`}
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
                    У Вас ще немає сайтів. Натисніть &quot;Новий Сайт&quot; щоб
                    створити його.
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
