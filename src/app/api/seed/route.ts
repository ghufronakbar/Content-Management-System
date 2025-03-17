import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const GET = async () => {
  return NextResponse.json("Hello World");
  const features = await prisma.feature.findMany({
    select: {
      title: true,
      content: true,
      image: true,
      subtitle: true,
    },
  });

  await prisma.feature.createMany({
    data: features,
  });

  return NextResponse.json("Successfull to create features");
};
