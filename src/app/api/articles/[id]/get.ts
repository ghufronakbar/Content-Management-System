import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const session = await serverSession();
    const article = await prisma.article.findUnique({
      include: {
        sections: true,
        author: true,
      },
      where: {
        id,
      },
    });

    if (!article) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    if (article.author?.email !== session?.user?.email) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
};
