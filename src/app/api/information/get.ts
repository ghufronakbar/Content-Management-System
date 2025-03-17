import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  const information = await prisma.information.findMany();  
  return NextResponse.json(information[0]);
};
