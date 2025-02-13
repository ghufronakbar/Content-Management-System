import { SectionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { title, slug, published, sections } = data;

    if (typeof title !== "string") {
      return NextResponse.json("Title is required", { status: 400 });
    }
    if (typeof slug !== "string") {
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
    }

    const check = await prisma.article.findUnique({
      where: { slug },
      select: {
        slug: true,
      },
    });

    if (check) {
      return NextResponse.json("Slug already taken", { status: 400 });
    }

    const create = await prisma.article.create({
      data: {
        sections: {
          createMany: {
            data: sections,
          },
        },
        published,
        slug,
        title,
        view: 0,
      },
      select: {
        slug: true,
      },
    });
    return NextResponse.json(create);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json("Internal server error", { status: 500 });
    } else {
      return NextResponse.json("Internal server error", { status: 500 });
    }
  }
};
