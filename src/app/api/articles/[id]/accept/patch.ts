import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export const PATCH = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const data = await req.json();
    const { accept } = data;
    console.log(data);
    if (typeof accept !== "boolean")
      return NextResponse.json("Invalid format", { status: 400 });

    const session = await serverSession();

    if (session.user.role !== "Admin")
      return NextResponse.json("Unauthorized", { status: 401 });

    const checkArticle = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        published: true,
        author: true,
        status: true,
      },
    });

    if (!checkArticle) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    const create = await prisma.article.update({
      data: {
        status: accept ? "Confirmed" : "Rejected",
        published: accept === false ? false : checkArticle.published,
      },
      select: {
        published: true,
      },
      where: {
        id,
      },
    });
    return NextResponse.json(
      create.published
        ? "The article has been successfully accepted."
        : "The article has been successfully rejected."
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json("Internal server error", { status: 500 });
    } else {
      return NextResponse.json("Internal server error", { status: 500 });
    }
  }
};
