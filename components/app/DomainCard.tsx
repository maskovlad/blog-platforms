import useSWR, { mutate } from "swr";
import { useState } from "react";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Site } from "@prisma/client";
import { css } from "@emotion/css";

type DomainData = Pick<
  Site,
  | "customDomain"
  | "description"
  | "id"
  | "image"
  | "imageBlurhash"
  | "name"
  | "subdomain"
>;

interface DomainCardProps<T = DomainData> {
  data: T;
}

export default function DomainCard({ data }: DomainCardProps) {
  const { data: valid, isValidating } = useSWR<Site>(
    `/api/domain/check?domain=${data.customDomain}`,
    fetcher,
    { revalidateOnMount: true, refreshInterval: 5000 }
  );
  const [recordType, setRecordType] = useState("CNAME");
  const [removing, setRemoving] = useState(false);
  const subdomain = // if domain is a subdomain
    data.customDomain && data.customDomain.split(".").length > 2
      ? data.customDomain.split(".")[0]
      : "";

  return (
    <div className={css`
      padding-top: 2.5rem;
      padding-bottom: 2.5rem; 
      margin-top: 2.5rem; 
      width: 100%; 
      max-width: 42rem; 
      border-radius: 0.5rem; 
      border-width: 1px; 
      border-color: #000000; 
    `}>
      <div className={css`
        display: flex; 
        padding-left: 2.5rem;
        padding-right: 2.5rem; 
        margin-top: 1rem; 
        flex-direction: column; 
        justify-content: space-between; 

        @media (min-width: 640px) { 
          margin-left: 1rem; 
          flex-direction: row; 
        }
      `}>
        <a 
          className={css`
            display: flex; 
            padding-left: 2.5rem;
            padding-right: 2.5rem; 
            margin-top: 1rem; 
            flex-direction: column; 
            justify-content: space-between; 

            @media (min-width: 640px) { 
              margin-left: 1rem; 
            flex-direction: row; 
            }
          `}
          href={`http://${data.customDomain}`}
          rel="noreferrer"
          target="_blank"
        >
          {data.customDomain}
          <span className={css`
            display: inline-block; 
            margin-left: 0.5rem;
          `}>
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
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </span>
        </a>
        <div className={css`
          display: flex; 
          margin: 0 0.75rem 0 0.875rem; 
        `}>
          <button
            onClick={() => {
              mutate(`/api/domain/check?domain=${data.customDomain}`);
            }}
            disabled={isValidating}
            className={css`
              padding-top: 0.375rem;
              padding-bottom: 0.375rem; 
              transition-property: all; 
              transition-duration: 150ms; 
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
              color: var(--c-grey); 
              font-size: 0.875rem;
              line-height: 1.25rem; 
              width: 6rem; 
              border-radius: 0.375rem; 
              border-width: 1px; 
              border-color: #E5E7EB; 
              border-style: solid; 
              ${isValidating
                ? "background-color: #F3F4F6;cursor: not-allowed;"
                : "background-color: #ffffff;:hover {color: #000000;border-color: #000000;}"}
            `}
          >
            {isValidating ? <LoadingDots /> : "Оновити"}
          </button>
          <button
            onClick={async () => {
              setRemoving(true);
              await fetch(
                `/api/domain?domain=${data.customDomain}&siteId=${data.id}`,
                {
                  method: HttpMethod.DELETE,
                }
              ).then((res) => {
                setRemoving(false);
                if (res.ok) {
                  mutate(`/api/site?siteId=${data.id}`);
                } else {
                  alert("Помилка видалення домену");
                }
              });
            }}
            disabled={removing}
            className={css`
              padding-top: 0.375rem;
              padding-bottom: 0.375rem; 
              background-color: var(--c-red); 
              transition-property: all; 
              transition-duration: 150ms; 
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
              color: #ffffff; 
              font-size: 0.875rem;
              line-height: 1.25rem; 
              width: 6rem; 
              border-radius: 0.375rem; 
              border-width: 1px; 
              border-color: var(--c-red); 
              border-style: solid; 
              ${removing ? "background-color: var(--c-white);cursor: not-allowed; " : ""}

              :hover {
                background-color: #ffffff; 
                color: var(--c-red); 
              }
            `}
          >
            {removing ? <LoadingDots /> : "Remove"}
          </button>
        </div>
      </div>

      <div className={css`
        display: flex; 
        padding-left: 2.5rem;
        padding-right: 2.5rem; 
        margin-top: 0.75rem;
        margin-bottom: 0.75rem; 
        margin-left: 0.75rem; 
        margin-left: 0.875rem; 
        align-items: center; 
      `}>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        >
          <circle cx="12" cy="12" r="10" fill={valid ? "#1976d2" : "#d32f2f"} />
          {valid ? (
            <>
              <path
                d="M8 11.8571L10.5 14.3572L15.8572 9"
                fill="none"
                stroke="white"
              />
            </>
          ) : (
            <>
              <path d="M15 9l-6 6" stroke="white" />
              <path d="M9 9l6 6" stroke="white" />
            </>
          )}
        </svg>
        <p className={css`
          font-size: 0.875rem;
          line-height: 1.25rem; 
          ${
          valid ? "color: #000000;font-weight: 400;" : "color:var(--c-red);font-weight: 500;"}
        `}>
          {valid ? "Valid" : "Invalid"} Configuration
        </p>
      </div>

      {!valid && (
        <>
          <div className={css`
            margin-top: 1.25rem; 
            margin-bottom: 2rem; 
            width: 100%; 
            border-top-width: 1px; 
            border-color: var(--c-white); 
          `} />

          <div className={css`padding:2.5rem;`}>
            <div className={css`
              display: flex; 
              justify-content: flex-start; 
              margin-left: 1rem; 
            `}>
              <button
                onClick={() => setRecordType("CNAME")}
                className={css`
                  padding-bottom: 0.25rem; 
                  transition: all 150ms; 
                  font-size: 0.875rem;
                  line-height: 1.25rem; 
                  border-bottom-width: 2px; 
                  ${recordType == "CNAME"
                    ? "color: #000000;border-color: #000000;"
                    : "color: var(--c-cyan);border-color: #ffffff;"}
                `}
              >
                CNAME Record (subdomains)
              </button>
              {/* if the custom domain is a subdomain, only show CNAME record */}
              {!subdomain && (
                <button
                  onClick={() => setRecordType("A")}
                  className={css`
                  padding-bottom: 0.25rem; 
                  transition: all 150ms; 
                  font-size: 0.875rem;
                  line-height: 1.25rem; 
                  border-bottom-width: 2px; 
                  ${recordType == "CNAME"
                      ? "color: #000000;border-color: #000000;"
                      : "color: var(--c-cyan);border-color: #ffffff;"}
                `}
                >
                  A Record (apex domain)
                </button>
              )}
            </div>
            <div className={css`
              margin-top: 0.75rem;
              margin-bottom: 0.75rem; 
              text-align: left; 
           `}>
              <p className={css`
                margin-top: 1.25rem;
                margin-bottom: 1.25rem; 
                font-size: 0.875rem;
                line-height: 1.25rem; 
              `}>
                Set the following record on your DNS provider to continue:
              </p>
              <div className={css`
                display: flex; 
                padding: 0.5rem; 
                margin-left: 2.5rem; 
                background-color: #F9FAFB; 
                justify-content: flex-start; 
                align-items: center; 
                border-radius: 0.375rem; 
              `}>
                <div>
                  <p className={css`
                    font-size: 0.875rem;
                    line-height: 1.25rem; 
                    font-weight: 700; 
                  `}>Type</p>
                  <p className={css`
                    margin-top: 0.5rem; 
                    font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
                    font-size: 0.875rem;
                    line-height: 1.25rem; 
                  `}>{recordType}</p>
                </div>
                <div>
                  <p className={css`
                    font-size: 0.875rem;
                    line-height: 1.25rem; 
                    font-weight: 700; 
                  `}>Name</p>
                  {/* if the custom domain is a subdomain, the CNAME record is the subdomain */}
                  <p className={css`
                    margin-top: 0.5rem; 
                    font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
                    font-size: 0.875rem;
                    line-height: 1.25rem; 
                  `}>
                    {recordType === "A"
                      ? "@"
                      : recordType == "CNAME" && subdomain
                      ? subdomain
                      : "www"}
                  </p>
                </div>
                <div>
                  <p className={css`
                    font-size: 0.875rem;
                    line-height: 1.25rem; 
                    font-weight: 700; 
                  `}>Value</p>
                  <p className={css`
                    margin-top: 0.5rem; 
                    font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
                    font-size: 0.875rem;
                    line-height: 1.25rem; 
                  `}>
                    {recordType == "CNAME" ? `cname.vercel.pub` : `76.76.21.21`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
