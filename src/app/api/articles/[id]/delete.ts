import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export const DELETE = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });

    if (!article) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    await prisma.article.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
};
