import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await req.json();
    const { name, email, password, title } = data;
    if (!name || !email || !password || !title)
      return NextResponse.json("All fields are required", { status: 400 });

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return NextResponse.json("User already exists", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        username: email.split("@")[0].toLowerCase(),
        password: hashedPassword,
        provider: "credentials",
        title,
        role: "User",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
};
