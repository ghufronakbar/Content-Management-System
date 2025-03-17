import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  const features = await prisma.feature.findMany();
  return NextResponse.json(features);
};
