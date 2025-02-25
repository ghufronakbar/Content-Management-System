import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sections: true,
    },
    where: {
      published: true,
    },
  });
  return NextResponse.json(articles);
};
