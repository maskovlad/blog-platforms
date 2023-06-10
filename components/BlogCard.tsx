import Link from "next/link";
import BlurImage from "./BlurImage";
import styles from "./BlogCard.module.css"
import type { Post } from "@prisma/client";
import { placeholderBlurhash } from "@/lib/util";

interface BlogCardProps {
  data: Pick<
    Post,
    "slug" | "image" | "imageBlurhash" | "title" | "description" | "createdAt"
  >;
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <Link href={`/${data.slug}`}>
      <div className={styles.wrapper}>
        {data.image ? (
          <BlurImage
            src={data.image}
            alt={data.title ?? "Blog Post"}
            width={500}
            height={400}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          />
        ) : (
          <div className={styles.image_plh}>
            ?
          </div>
        )}
        <div className={styles.text}>
          <h3>{data.title}</h3>
          <p className={styles.description}>
            {data.description}
          </p>
          <p className={styles.date}>
            Опубліковано{" "}
            {data.createdAt.toLocaleDateString("uk-UK", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
