import { NextPage } from "next";
import CreateArticleClient from "./client";
import prisma from "~/config/prisma";

const fetchCategories = async (): Promise<string[]> => {
  const data = await prisma.article.findMany({
    select: { category: true },
    distinct: "category",
  });
  return data.map((item) => item.category);
};

const CreateArticlePage: NextPage = async () => {
  const categories = await fetchCategories();
  return <CreateArticleClient categories={categories} />;
};

export default CreateArticlePage;
