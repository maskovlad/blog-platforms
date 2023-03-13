import { cache } from "react";
import type { _SiteData } from "@/types";
import prisma from "@/lib/prisma";

export const getSiteData = cache(async (site: string): Promise<_SiteData> => {
  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site,
  };

  if (site.includes(".")) {
    filter = {
      customDomain: site.replace("%3A3000",""),
    };
  }

  console.log(filter)

  const data = (await prisma.site.findUnique({
    where: filter,
    include: {
      user: true,
      posts: {
        where: {
          published: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      },
    },
  })) as _SiteData;

  return data;
});

export const getPostData = cache(async (site: string, slug: string) => {
  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site,
  };

  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }

  // тягнем пост по сайту і слагу
  const data = await prisma.post.findFirst({
    where: {
      site: {
        ...filter,
      },
      slug,
    },
    include: {
      site: {
        include: {
          user: true,
        },
      },
    },
  });

  console.log({fetchers:data})

  if (!data) return { notFound: true, revalidate: 10 };

  const adjacentPosts = await prisma.post.findMany({      // шукаємо ще пости
      where: {
        site: {
          ...filter,
        },
        published: true,
        NOT: {
          id: data.id,
        },
      },
      select: {
        slug: true,
        title: true,
        createdAt: true,
        description: true,
        image: true,
        imageBlurhash: true,
      },
    })

  return {
    data,
    adjacentPosts,
  };
});
