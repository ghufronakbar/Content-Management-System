import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ id: string }>;
}
export const DELETE = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

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

    await prisma.feature.delete({
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
