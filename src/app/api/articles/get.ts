import { NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

export const GET = async () => {
  const session = await serverSession();
  if (session.user.role !== "Admin") {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sections: true,
        author: {
          select: {
            username: true,
            role: true,
            email: true,
          },
        },
      },
      where: {
        author: {
          email: session?.user?.email || "",
        },
      },
    });
    return NextResponse.json(articles);
  } else {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sections: true,
        author: {
          select: {
            username: true,
            role: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(articles);
  }
};
