import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ username: string }>;
}

export const GET = async (req: NextRequest, { params }: Params) => {
  const { username } = await params;
  if (!username) return NextResponse.json("Missing id", { status: 404 });

  const author = await prisma.user.findUnique({
    where: { username },
    include: {
      articles: {
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sections: true,
        },
      },
    },
  });

  if (!author) return NextResponse.json("Author not found", { status: 404 });

  return NextResponse.json(author);
};
