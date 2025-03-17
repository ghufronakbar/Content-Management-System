import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  const authors = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          articles: {
            where: {
              AND: [
                {
                  status: "Confirmed",
                },
                {
                  published: true,
                },
              ],
            },
          },
        },
      },
    },
    take: 5,
  });
  const orderedAuthors = authors.sort(
    (a, b) => b._count.articles - a._count.articles
  );
  return NextResponse.json(orderedAuthors);
};
