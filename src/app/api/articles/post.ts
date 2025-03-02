import { SectionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await req.json();

    const { title, slug, published, sections, topics, category } = data;

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

    if (typeof topics !== "object") {
      return NextResponse.json("Invalid format", { status: 400 });
    }

    if (!Array.isArray(topics)) {
      return NextResponse.json("Invalid format", { status: 400 });
    }

    for (const topic of topics) {
      if (typeof topic !== "string") {
        return NextResponse.json("Invalid format", { status: 400 });
      }
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

    const check = await prisma.article.findUnique({
      where: { slug: slug || "something" },
      select: {
        slug: true,
      },
    });

    if (check) {
      return NextResponse.json("Slug already taken", { status: 400 });
    }

    const session = await serverSession();
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email || "",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json("User not found", { status: 400 });
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
        category,
        topics,
        userId: user.id,
      },
      select: {
        slug: true,
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
