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
          className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
        >
          <h2 className="font-cal text-2xl mb-6">Створення нового сайту</h2>
          <div className="grid gap-y-5 w-5/6 mx-auto">
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <span className="pl-5 pr-1">📌</span>
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                name="name"
                required
                placeholder="Site Name"
                ref={siteNameRef}
                type="text"
              />
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <span className="pl-5 pr-1">🪧</span>
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
                name="subdomain"
                onInput={() => setSubdomain(siteSubdomainRef.current!.value)}
                placeholder="Subdomain"
                ref={siteSubdomainRef}
                type="text"
              />
              <span className="px-5 bg-gray-100 h-full flex items-center rounded-r-lg border-l border-gray-600">
                .{process.env.NEXT_PUBLIC_SITE_URL}
              </span>
            </div>
            {error && (
              <p className="px-5 text-left text-red-500">
                <b>{error}</b> вже зайнятий. Спробуйте, будь ласка інший субдомен.
              </p>
            )}
            <div className="border border-gray-700 rounded-lg flex flex-start items-top">
              <span className="pl-5 pr-1 mt-3">✍️</span>
              <textarea
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                name="description"
                placeholder="Description"
                ref={siteDescriptionRef}
                required
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-10 w-full">
            <button
              type="button"
              className="w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
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
              className={`${creatingSite || error
                ? "cursor-not-allowed text-gray-400 bg-gray-50"
                : "bg-white text-gray-600 hover:text-black"
                } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
            >
              {creatingSite ? <LoadingDots /> : "CREATE SITE"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Усі сайти */}
      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 justify-between items-center">
          <h1 className="font-cal text-5xl">Мої сайти</h1>
          <button
            onClick={() => setShowModal(true)}
            className="font-cal text-lg w-3/4 sm:w-48 tracking-wide text-white bg-black border-black border-2 px-5 py-3 hover:bg-white hover:text-black transition-all ease-in-out duration-150"
          >
            Новий Сайт <span className="ml-2">＋</span>
          </button>
        </div>
        <div className="my-10 grid gap-y-10">
          {sites ? (
            sites.length > 0 ? (
              sites.map((site) => (
                <div key={site.id} className='block md:grid grid-cols-[repeat(auto-fit,minmax(325px,1fr))]'>

                  <Link href={`/site/${site.id}`}>
                    <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden">
                      <div className="relative w-full h-60 md:h-auto md:flex-none">
                        {site.image ? (
                          <BlurImage
                            src={site.image}
                            width={500}
                            height={400}
                            className="h-full object-cover cursor-pointer"
                            alt={site.name ?? "Site thumbnail"}
                          />
                        ) : (
                          <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-4xl select-none">
                            ?
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="relative p-10">
                    <Link href={`/site/${site.id}`} >
                      <h2 className="font-cal text-3xl cursor-pointer">{site.name}</h2>
                    </Link>
                    <p className="text-base my-5 line-clamp-3">
                      {site.description}
                    </p>
                    <a
                      className="font-cal px-3 py-1 tracking-wide rounded bg-gray-200 text-gray-600 absolute bottom-5 left-10 whitespace-nowrap"
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
                <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300" />
                  <div className="relative p-10 grid gap-5">
                    <div className="w-28 h-10 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-cal text-gray-600">
                    У Вас ще немає сайтів. Натисніть &quot;Новий Сайт&quot; щоб створити його.
                  </p>
                </div>
              </>
            )
          ) : (
            [0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
                <div className="relative p-10 grid gap-5">
                  <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
