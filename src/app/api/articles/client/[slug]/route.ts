import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      include: {
        sections: true,
        author: true,
      },
      where: {
        slug,
      },
    });

    if (!article) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    if (article && article.published === false) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        view: article.view + 1,
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
