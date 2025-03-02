import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export const PATCH = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const session = await serverSession();

    const checkArticle = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        published: true,
        author: true,
      },
    });

    if (!checkArticle) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    if (checkArticle.author?.email !== session?.user?.email) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const create = await prisma.article.update({
      data: {
        published: !checkArticle.published,
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
        ? "The article has been successfully published."
        : "The article has been successfully saved as a draft."
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
