import { NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

export const GET = async () => {
  const session = await serverSession();
  if(!session) return NextResponse.json(null);
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });
  return NextResponse.json(user);
};
