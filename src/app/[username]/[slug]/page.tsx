import { Metadata, NextPage } from "next";
import DetailArticleClient from "./client";
import prisma from "~/config/prisma";
import { BASE_URL } from "~/constants";

interface Params {
  params: Promise<{ slug: string; username: string }>;
}

const fetchArticle = async (slug: string) => {
  return await prisma.article.findUnique({
    where: { slug },
    include: { sections: true },
  });
};

export const generateMetadata = async (props: Params): Promise<Metadata> => {
  const { slug, username } = await props.params;
  const article = await fetchArticle(slug);
  const url = `${BASE_URL}/${username}/${slug}`;
  return {
    title: `${article?.title || "Not Found"} | Socio Engineer`,
    description: article?.sections
      .filter((section) => section.type !== "Image")
      .map((section) => section.content)
      .join(" "),
    openGraph: {
      title: article?.title,
      description: article?.sections
        .filter((section) => section.type !== "Image")
        .map((section) => section.content)
        .join(" "),
      url,
      images: article?.sections
        .filter((section) => section.type === "Image")
        .map((section) => ({
          url: section.content,
          width: 1200,
          height: 630,
        })),
    },
    twitter: {
      card: "summary_large_image",
      title: article?.title,
      description: article?.sections
        .filter((section) => section.type !== "Image")
        .map((section) => section.content)
        .join(" "),
      images: article?.sections
        .filter((section) => section.type === "Image")
        .map((section) => section.content),
    },
  };
};

const DetailArticle: NextPage<Params> = async ({ params }) => {
  const { slug, username } = await params;
  return <DetailArticleClient slug={slug} username={username} />;
};

export default DetailArticle;
