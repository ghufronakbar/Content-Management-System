import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ id: string }>;
}
export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const { data } = await req.json();
    const { title, subtitle, content, image } = data;    
    if (!title || !subtitle || !content || !image)
      return NextResponse.json("All fields are required", { status: 400 });

    const check = await prisma.feature.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    if (!check) {
      return NextResponse.json("Feature not found", { status: 404 });
    }
    await prisma.feature.update({
      data: {
        title,
        subtitle,
        content,
        image,
      },
      where: {
        id,
      },
    });
    return NextResponse.json("Successfull to edit feature");
  } catch (error) {
    console.error(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
};
