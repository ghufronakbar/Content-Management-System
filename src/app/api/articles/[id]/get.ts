import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      include: {
        sections: true,
      },
      where: {
        id,
      },
    });

    if (!article) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
};
