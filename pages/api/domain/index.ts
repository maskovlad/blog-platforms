/* Добавляйте домены в свой проект Vercel, используя эту конечную точку , когда пользователь добавляет ее на вашу платформу. 
Это возвращает 3 возможных результата:
Код состояния 403: домен уже принадлежит другой команде, но вы все равно можете запросить делегирование у команды и добавить его.
Код состояния 409: домен уже используется другим проектом. Вы не можете добавить его, пока домен не будет удален из проекта.
Код состояния 200: Домен успешно добавлен. */

import { createDomain, deleteDomain } from "@/lib/api";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../_auth/[...nextauth]";
import { HttpMethod } from "@/types/http";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function domain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.POST:
      return createDomain(req, res);
    case HttpMethod.DELETE:
      return deleteDomain(req, res);
    default:
      res.setHeader("Allow", [HttpMethod.POST, HttpMethod.DELETE]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
