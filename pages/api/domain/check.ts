import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types/http";

import type { NextApiRequest, NextApiResponse } from "next";

/*
 * Примітка. Ця кінцева точка призначена для перевірки, чи правильно налаштовано сервери імен/запис домену.
 * Щоб надіслати запит на доступ до домену, який належить іншій команді, потрібно використовувати
 * кінцеву точку `/verify`: https://vercel.com/docs/rest-api#endpoints/projects/verify-project-domain
 * Ви можете побачити приклад реалізації тут: https://github.com/vercel/examples/tree/main/solutions/domains-api
 */

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== HttpMethod.GET) {
    res.setHeader("Allow", [HttpMethod.GET]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { domain, subdomain = false } = req.query;

  if (Array.isArray(domain))
    return res
      .status(400)
      .end("Bad request. domain parameter cannot be an array.");

  try {
    // *перевірка доступності до реєстрації субдомену
    if (subdomain) {
      const sub = (domain as string).replace(/[^a-zA-Z0-9/-]+/g, "");

      const data = await prisma.site.findUnique({
        where: {
          subdomain: sub,
        },
      });

      const available = data === null && sub.length !== 0;

      return res.status(200).json(available);
    }

    //* реєстрація субдомену в vercel
    const response = await fetch(
      // todo поставити свій запрос ?
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: HttpMethod.GET,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // *  вдало чи ні
    const valid = data?.configuredBy ? true : false;

    return res.status(200).json(valid);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
