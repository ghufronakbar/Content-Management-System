import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

interface Params {
  params: Promise<{ id: string }>;
}
export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

    const feature = await prisma.feature.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    if (!feature) {
      return NextResponse.json("Feature not found", { status: 404 });
    }
    return NextResponse.json(feature);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
};
