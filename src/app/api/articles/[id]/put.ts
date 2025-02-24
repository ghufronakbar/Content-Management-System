import { SectionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const { data } = await req.json();

    const { title, slug, published, sections, category } = data;

    if (typeof title !== "string") {
      return NextResponse.json("Title is required", { status: 400 });
    }
    if (typeof slug !== "string") {
      return NextResponse.json("Slug is required", { status: 400 });
    }
    if (typeof category !== "string") {
      return NextResponse.json("Slug is required", { status: 400 });
    }
    if (typeof published !== "boolean") {
      return NextResponse.json("Published is required", { status: 400 });
    }

    if (typeof sections !== "object") {
      return NextResponse.json("Invalid format", { status: 400 });
    }

    if (!Array.isArray(sections)) {
      return NextResponse.json("Invalid format", { status: 400 });
    }

    for (const section of sections) {
      if (typeof section.content !== "string") {
        return NextResponse.json("Content is required", { status: 400 });
      }
      if (
        typeof section.type !== "string" ||
        !Object.values(SectionType).includes(section.type)
      ) {
        return NextResponse.json("Type is not valid", { status: 400 });
      }

      for (const key in section) {
        if (key !== "content" && key !== "type") {
          delete section[key];
        }
      }
    }

    const [checkSlug, checkId] = await Promise.all([
      prisma.article.findUnique({
        where: { slug },
        select: {
          id: true,
        },
      }),
      prisma.article.findUnique({
        where: { id },
        select: {
          id: true,
        },
      }),
    ]);

    if (checkSlug && checkSlug.id !== id) {
      return NextResponse.json("Slug already taken", { status: 400 });
    }

    if (!checkId) {
      return NextResponse.json("Article not found", { status: 404 });
    }

    await prisma.section.deleteMany({
      where: {
        articleId: id,
      },
    });

    const create = await prisma.article.update({
      data: {
        sections: {
          createMany: {
            data: sections,
          },
        },
        published,
        slug,
        title,
        category,
      },
      select: {
        slug: true,
      },
      where: {
        id,
      },
    });
    return NextResponse.json(create);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json("Internal server error", { status: 500 });
    } else {
      return NextResponse.json("Internal server error", { status: 500 });
    }
  }
};
