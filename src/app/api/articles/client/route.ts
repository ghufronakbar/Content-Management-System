import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sections: true,
      author: true,
    },
    where: {
      AND: [
        {
          published: true,
        },
        {
          status: "Confirmed",
        },
      ],
    },
  });
  return NextResponse.json(articles);
};
