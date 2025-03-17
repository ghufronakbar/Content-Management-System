import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await req.json();
    const information = await prisma.information.findMany();

    await prisma.information.update({
      where: {
        id: information[0].id,
      },
      data: {
        featureTitle: data.featureTitle || information[0].featureTitle,
        greetText: data.greetText || information[0].greetText,
        greetTitle: data.greetTitle || information[0].greetTitle,
        heroTitle: data.heroTitle || information[0].heroTitle,
        subtitleHero: data.subtitleHero || information[0].subtitleHero,
        imageHero: data.imageHero || information[0].imageHero,
      },
    });
    return NextResponse.json("Successfull to update information");
  } catch (error) {
    console.error(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
};
