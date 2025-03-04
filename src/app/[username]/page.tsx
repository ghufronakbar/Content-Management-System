import { Metadata } from "next";
import AuthorPageClient from "./client";
import prisma from "~/config/prisma";
import { BASE_URL } from "~/constants";
import { PLACEHOLDER } from "~/constants/image";

interface Params {
  params: Promise<{ username: string }>;
}

export const generateMetadata = async (props: Params): Promise<Metadata> => {
  const { username } = await props.params;
  const url = `${BASE_URL}/${username}`;
  const author = await prisma.user.findUnique({
    where: { username },
    select: { name: true, description: true, image: true },
  });
  return {
    title: `${author?.name || "Not Found"} | Socio Point`,
    description: author?.description || "No bio available",
    openGraph: {
      title: `${author?.name || "Not Found"} | Socio Point`,
      description: author?.description || "No bio available",
      url,
      images: [
        {
          url: author?.image || PLACEHOLDER,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${author?.name || "Not Found"} | Socio Point`,
      description: author?.description || "No bio available",
      images: [author?.image || PLACEHOLDER],
    },
  };
};

const AuthorPage = async ({ params }: Params) => {
  const { username } = await params;
  return <AuthorPageClient username={username} />;
};

export default AuthorPage;
