import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username") || "";

  const checkUsername = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (checkUsername) {
    return NextResponse.json({ isExist: true });
  } else {
    return NextResponse.json({ isExist: false });
  }
};
