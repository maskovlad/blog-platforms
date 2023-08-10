import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingDots from "@/components/app/loading-dots";
import toast, { Toaster } from "react-hot-toast";
import { css } from "@emotion/css";

const pageTitle = "Login";
const logo = "/favicon.ico";
const description =
  "Platforms Starter Kit is a comprehensive template for building multi-tenant applications with custom domains.";

export default function Login() {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const { query } = useRouter();
  const { error } = query;

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <div className={css`
        display: flex; 
        padding-top: 3rem;
        padding-bottom: 3rem; 
        background-color: var(--c-white); 
        flex-direction: column; 
        justify-content: center; 
        min-height: 100vh; 

        @media (min-width: 640px) { 
          padding-left: 1.5rem;
          padding-right: 1.5rem; 
        }

        @media (min-width: 1024px) { 
          padding-left: 2rem;
          padding-right: 2rem; 
        }
    `}>

      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" type="image/x-icon" href={logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={logo} />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={pageTitle} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={logo} />
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logo} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={logo} />
      </Head>

      <div className={css`
        @media (min-width: 640px) { 
          margin-left: auto;
          margin-right: auto; 
          width: 100%; 
          max-width: 28rem; 
          text-align: center;
        }
      `}>
        <Image
          alt="Platforms Starter Kit"
          width={100}
          height={100}
          className={css`
            position: relative; 
            margin-left: auto;
            margin-right: auto; 
          `}
          src="/ss-logo-black.png"
        />
        <h2 className={css`
          margin-top: 1.5rem; 
          color: #111827; 
          font-size: 1.875rem;
          line-height: 2.25rem; 
          font-weight: 800; 
          text-align: center; 
        `}>
          Українська Блогова Платформа Sviy.Site
        </h2>
        <p className={css`
          margin-top: 0.5rem; 
          color: var(--c-darkgrey); 
          font-size: 0.875rem;
          line-height: 1.25rem; 
          text-align: center; 
        `}>
          Увійдіть або зареєструйтеся за допомогою:
        </p>
      </div>

      <div className={css`
        margin-left: auto;
        margin-right: auto; 
        margin-top: 2rem; 
        width: 91.666667%; 

        @media (min-width: 640px) { 
          width: 100%; 
          max-width: 28rem; 
          text-align: center;
        }
      `}>
        <div className={css`
          padding-left: 1rem;
          padding-right: 1rem; 
          padding-top: 2rem;
          padding-bottom: 2rem; 
          background-color: #ffffff; 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 

          @media (min-width: 640px) { 
            padding-left: 2.5rem;
          padding-right: 2.5rem; 
          border-radius: 0.5rem; 
          }
        `}>
          <button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              signIn("github");
            }}
            className={css`
                display: flex; 
                margin: 0.5rem 0; 
                justify-content: center; 
                align-items: center; 
                width: 100%; 
                height: 4rem; 
                border-radius: 0.375rem; 
                cursor: pointer; 
                ${loading ? "background-color: var(--c-grey); cursor: not-allowed;" : "background-color: #000;"}
              `}>
            {loading ? (
              <LoadingDots color="#fff" />
            ) : (
              <svg className={css`
                width: 2rem; 
                height: 2rem; 
              `}
                aria-hidden="true"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
