import Layout from "@/components/app/Layout";
import toast, { Toaster } from "react-hot-toast";
import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import LoadingDots from "@/components/app/loading-dots";
import { HttpMethod } from "@/types";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import type { UserSettings } from "@/types";
import { css } from "@emotion/css";

export default function AppSettings() {
  const { data: session } = useSession();

  const [saving, setSaving] = useState<boolean>(false);
  const [data, setData] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (session)
      setData({
        ...session.user,
      });
  }, [session]);

  async function saveSettings(data: UserSettings | null) {
    setSaving(true);
    const response = await fetch("/api/save-settings", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        ...data,
      }),
    });
    if (response.ok) {
      setSaving(false);
      toast.success(`Зміни збережено!`);
    }
  }

  return (
    <>
      <Layout>
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
            margin-top: 2.5rem;
            margin-bottom: 4rem;
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
            `}
          >
            Налаштування користувача
          </h1>
          <div
            className={css`
              display: flex;
              margin-bottom: 7rem;
              margin-top: 3rem;
              flex-direction: column;
            `}
          >
            <div
              className={css`
                margin-top: 1.5rem;
              `}
            >
              <h2>Ім&apos;я</h2>
              <div
                className={css`
                  display: flex;
                  overflow: hidden;
                  align-items: center;
                  max-width: 32rem;
                  border-radius: 0.5rem;
                  border-width: 1px;
                  border-color: var(--c-grey);
                  margin-top: 1rem;
                `}
              >
                <input
                  className={css`
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    padding-left: 1.25rem;
                    padding-right: 1.25rem;
                    background-color: #ffffff;
                    color: var(--c-grey);
                    width: 100%;
                    border-radius: 0.5rem;
                    border-style: none;

                    :focus {
                      outline: none;
                    }
                  `}
                  type="text"
                  name="name"
                  placeholder="І'мя користувача"
                  value={data?.name || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      name: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
              </div>
            </div>

            <div
              className={css`
                margin-top: 3rem;
              `}
            >
              <h2>Email</h2>
              <div
                className={css`
                  display: flex;
                  overflow: hidden;
                  align-items: center;
                  max-width: 32rem;
                  border-radius: 0.5rem;
                  border-width: 1px;
                  border-color: var(--c-grey);
                  margin-top: 1rem;
                `}
              >
                <input
                  className={css`
                    padding-top: 0.75rem;
                    padding-bottom: 0.75rem;
                    padding-left: 1.25rem;
                    padding-right: 1.25rem;
                    background-color: #ffffff;
                    color: var(--c-grey);
                    width: 100%;
                    border-radius: 0.5rem;
                    border-style: none;

                    :focus {
                      outline: none;
                    }
                  `}
                  type="email"
                  name="email"
                  placeholder="panic@thedis.co"
                  value={data?.email || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      email: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
              </div>
            </div>
            <div
              className={css`
                margin-top: 3rem;
              `}
            >
              <h2>Аватар</h2>
              <div
                className={css`
                  position: relative;
                  margin-top: 1.25rem;
                  width: 12rem;
                  height: 12rem;
                  border-radius: 0.375rem;
                  border-width: 2px;
                  border-color: #1f2937;
                  border-style: dashed;

                  ${data?.image
                    ? ""
                    : "background-color: var(--c-lightgrey); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;@keyframes pulse {0%, 100% {opacity: 1;}50% { opacity: .5;}}; "}
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

                {data?.image && (
                  <BlurImage
                    src={data.image}
                    alt="Cover Photo"
                    width={100}
                    height={100}
                    className={css`
                      width: 100%;
                      height: auto;
                      border-radius: 0.375rem;
                    `}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

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
                saveSettings(data);
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
