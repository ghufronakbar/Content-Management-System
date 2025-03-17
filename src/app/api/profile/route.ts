import { NextRequest, NextResponse } from "next/server";
import prisma from "~/config/prisma";
import { serverSession } from "~/services/auth";

export const GET = async () => {
  const session = await serverSession();
  if (!session) return NextResponse.redirect("/");
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });
  return NextResponse.json(user);
};

export const PUT = async (req: NextRequest) => {
  try {
    const { data } = await req.json();
    const { name, username, description, title } = data;
    if (!name || !username || !description || !title)
      return NextResponse.json("All fields are required", { status: 400 });
    if (typeof name !== "string" || typeof username !== "string")
      return NextResponse.json("Invalid format", { status: 400 });
    const session = await serverSession();
    if (!session) return NextResponse.redirect("/");
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email || "",
      },
      select: {
        id: true,
      },
    });
    const checkUsername = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (!user) return NextResponse.json("User not found", { status: 404 });
    if (checkUsername && checkUsername.id !== user.id)
      return NextResponse.json("Username already exists", { status: 400 });
    const updatedUser = await prisma.user.update({
      where: {
        email: session?.user?.email || "",
      },
      data: {
        name,
        username,
        description,
        title,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(error.message, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  const { data } = await req.json();
  const { image } = data;
  const session = await serverSession();
  if (!session) return NextResponse.redirect("/");
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
    select: {
      id: true,
    },
  });
  if (!user) return NextResponse.json("User not found", { status: 404 });
  const updatedUser = await prisma.user.update({
    where: {
      email: session?.user?.email || "",
    },
    data: {
      image: image || null,
    },
  });
  return NextResponse.json(updatedUser);
};
