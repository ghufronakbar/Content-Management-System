import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  const authors = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          articles: {
            where: {
              published: true,
            },
          },
        },
      },
    },
    orderBy: {
      articles: {
        _count: "desc",
      },
    },
    take: 5,
  });
  return NextResponse.json(authors);
};
