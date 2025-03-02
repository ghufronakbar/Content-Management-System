import { NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

export const GET = async () => {
  const session = await serverSession();
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sections: true,
    },
    where: {
      author: {
        email: session?.user?.email || "",
      },
    },
  });
  return NextResponse.json(articles);
};
