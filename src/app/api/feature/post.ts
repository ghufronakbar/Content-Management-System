import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await req.json();
    const { title, subtitle, content, image } = data;
    if (!title || !subtitle || !content || !image)
      return NextResponse.json("All fields are required", { status: 400 });
    await prisma.feature.create({
      data: {
        title,
        subtitle,
        content,
        image,
      },
    });
    return NextResponse.json("Successfull to create feature");
  } catch (error) {
    console.error(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
};
