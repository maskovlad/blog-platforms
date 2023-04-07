import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "../../lib/useRequireAuth";

import type { WithChildren } from "@/types";
import { css } from "@emotion/css";

interface LayoutProps extends WithChildren {
  siteId?: string;
}

export default function Layout({ siteId, children }: LayoutProps) {
  const title = "Українська Блогова Платформа - Свій.Site";
  const description = "Створи власний повноцінний сайт-блог. Розвивай, просувай і заробляй з найшвидшою і найнадійнішою хмарною платформою Свій.Site";
  const logo = "/favicon.ico";
  const router = useRouter();
  const sitePage = router.pathname.startsWith("/app/site/[id]");
  const postPage = router.pathname.startsWith("/app/post/[id]");
  const rootPage = !sitePage && !postPage;
  const tab = rootPage
    ? router.asPath.split("/")[1]
    : router.asPath.split("/")[3];

  const session = useRequireAuth();
  if (!session) return <Loader />;

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Vercel" />
          <meta name="twitter:creator" content="@StevenTey" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>

        <div
          className={css`
            position: absolute;
            right: 0;
            left: 0;
            background-color: #ffffff;
            height: 4rem;
            border-bottom-width: 1px;
            border-color: #e5e7eb;
          `}
        >
          <div
            className={css`
              display: flex;
              padding-left: 5rem;
              padding-right: 5rem;
              margin-left: auto;
              margin-right: auto;
              justify-content: space-between;
              align-items: center;
              max-width: 1280px;
              height: 100%;

              @media (max-width: 640px) {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
              }
            `}
          >
            <div
              className={css`
                display: flex;
                gap: 1rem;
              `}
            >
              <Link
                href="/"
                className={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                `}
              >
                {session.user && session.user.image && (
                  <div
                    className={css`
                      display: inline-block;
                      overflow: hidden;
                      vertical-align: middle;
                      width: 2rem;
                      height: 2rem;
                      border-radius: 9999px;
                    `}
                  >
                    <Image
                      src={session.user.image}
                      width={32}
                      height={32}
                      alt={session.user.name ?? "User avatar"}
                    />
                  </div>
                )}
                <span
                  className={css`
                    display: inline-block;
                    margin-left: 0.75rem;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    @media (min-width: 640px) {
                      display: block;
                    }
                  `}
                >
                  {session.user?.name}
                </span>
              </Link>
              <div
                className={css`
                  height: 2rem;
                  border-width: 1px;
                  border-color: #d1d5db;
                `}
              />
              <button
                className={css`
                  transition-property: all;
                  transition-duration: 150ms;
                  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                  color: #6b7280;

                  :hover {
                    color: #374151;
                  }
                `}
                onClick={() => signOut()}
              >
                Вийти
              </button>
            </div>
            <a
              className={css`
                display: flex;
                padding-top: 0.75rem;
                padding-bottom: 0.75rem;
                padding-left: 1.25rem;
                padding-right: 1.25rem;
                margin-left: 0.5rem;
                transition-property: all;
                transition-duration: 150ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                color: #374151;
                align-items: center;

                @media (min-width: 640px) {
                  :hover {
                    background-color: #ffffff;
                  }
                }
              `}
              href="https://github.com/vercel/platforms"
              rel="noreferrer"
              target="_blank"
            >
              <p className="hidden sm:block">Build my own</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {rootPage && (
          <div
            className={css`
              display: flex;
              position: absolute;
              right: 0;
              left: 0;
              top: 4rem;
              background-color: #ffffff;
              justify-content: center;
              align-items: center;
              border-bottom-width: 1px;
              border-color: #e5e7eb;
              font-weight: 500;
              padding-left: 10%;
              padding-right: 10%;
              gap: 10%;
            `}
          >
            <Link
              href="/"
              className={css`
                border-bottom-width: 2px;
                padding-top: 0.75rem;
                padding-bottom: 0.75rem;
                ${tab == ""
                  ? "border-color: #000000;"
                  : "border-color: transparent;"}
              `}
            >
              Мої сайти
            </Link>
            <Link
              href="/settings"
              className={css`
                border-bottom-width: 2px;
                padding-top: 0.75rem;
                padding-bottom: 0.75rem;
                ${tab == "settings"
                  ? "border-color: #000000;"
                  : "border-color: transparent;"}
              `}
            >
              Налаштування
            </Link>
          </div>
        )}

        {sitePage && (
          <div className="app_menu">
            <div
              className={css`
                display: flex;
                padding-left: 10%;
                padding-right: 10%;
                margin-left: auto;
                margin-right: auto;
                justify-content: flex-start;
                font-weight: 500;
                align-items: center;
                max-width: 1280px;

                @media (max-width: 640px) {
                  justify-content: center;
                }
                @media (max-width: 425px) {
                  justify-content: center;
                  padding-left: 5%;
                  padding-right: 5%;
                }
              `}
            >
              <Link
                href="/"
                className={css`
                  display: inline-block;
                  flex: 1;
                  white-space: nowrap;

                  @media (max-width: 768px) {
                    display: none;
                  }
                `}
              >
                ← Усі Сайти
              </Link>

              <div
                className={css`
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  flex: 2;
                `}
              >
                <Link
                  href={`/site/${router.query.id}`}
                  className={css`
                    border-bottom-width: 2px;
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    ${!tab
                      ? "border-color: #000000;"
                      : "border-color: transparent;"}
                  `}
                >
                  Пости
                </Link>
                <Link
                  href={`/site/${router.query.id}/drafts`}
                  className={css`
                    border-bottom-width: 2px;
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    ${tab == "drafts"
                      ? "border-color: #000000;"
                      : "border-color: transparent;"}
                  `}
                >
                  Чернетки
                </Link>
                <Link
                  href={`/site/${router.query.id}/settings`}
                  className={css`
                    border-bottom-width: 2px;
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    ${tab == "settings"
                      ? "border-color: #000000;"
                      : "border-color: transparent;"}
                  `}
                >
                  Налаштування
                </Link>
              </div>

              <div
                className={css`
                  flex: 1;

                  @media (max-width: 768px) {
                    display: none;
                  }
                `}
              />
            </div>
          </div>
        )}

        {postPage && (
          <div className="app_menu">
            <div
              className={css`
                display: flex;
                padding-left: 10%;
                padding-right: 10%;
                margin-left: auto;
                margin-right: auto;
                justify-content: flex-start;
                font-weight: 500;
                align-items: center;
                max-width: 1280px;

                @media (max-width: 640px) {
                  justify-content: center;
                }
                @media (max-width: 425px) {
                  justify-content: center;
                  padding-left: 5%;
                  padding-right: 5%;
                }
              `}
            >
              {siteId ? ( //? непонятно
                <Link
                  href={`/site/${siteId}`}
                  className={css`
                    display: inline-block;
                    flex: 1;
                    white-space: nowrap;

                    @media (max-width: 768px) {
                      display: none;
                    }
                  `}
                >
                  ← Всі Пости
                </Link>
              ) : (
                <div>
                  ←
                  <p
                    className={css`
                      display: none;
                      margin-left: 0.75rem;

                      @media (min-width: 768px) {
                        display: inline-block;
                      }
                    `}
                  >
                    Усі Пости
                  </p>
                </div>
              )}

              <div
                className={css`
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  flex: 2;
                `}
              >
                <Link
                  href={`/post/${router.query.id}`}
                  className={css`
                    border-bottom-width: 2px;
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    ${!tab
                      ? "border-color: #000000;"
                      : "border-color: transparent;"}
                  `}
                >
                  Редактор
                </Link>
                <Link
                  href={`/post/${router.query.id}/settings`}
                  className={css`
                    border-bottom-width: 2px;
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    ${tab == "settings"
                      ? "border-color: #000000;"
                      : "border-color: transparent;"}
                  `}
                >
                  Налаштування
                </Link>
              </div>
              
              <div
                className={css`
                  flex: 1;

                  @media (max-width: 768px) {
                    display: none;
                  }
                `}
              />
            </div>
          </div>
        )}

        <div
          className={css`
            padding-top: 7rem;
          `}
        >
          {children}
        </div>
      </div>
    </>
  );
}
