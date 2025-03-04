"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { MdArticle } from "react-icons/md";
import ArticleCardMini from "~/components/material/ArticleCardMini";
import Section from "~/components/material/Section";
import { PLACEHOLDER } from "~/constants/image";
import { DetailUser } from "~/models/response/user";
import LoadingPage from "../loading";
import NotFoundPage from "../not-found";

interface Props {
  username: string;
}

const AuthorPageClient: FC<Props> = ({ username }) => {
  const [data, setData] = useState<DetailUser>();
  const [noData, setNoData] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get<DetailUser>("/api/authors/" + username);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setNoData(true);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalViews = data?.articles.reduce(
    (acc, article) => acc + article.view,
    0
  );
  const topArticles = data?.articles
    .sort((a, b) => b.view - a.view)
    .slice(0, 3);

  if (noData) return <NotFoundPage />;

  if (!data) return <LoadingPage />;

  return (
    <Section id="article" padded className="min-h-screen pt-24">
      <div className="w-full h-full min-h-screen flex flex-col gap-4">
        <div className="w-full min-h-screen flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 xl:w-3/4 hide-scrollbar">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              <Image
                src={data.image || PLACEHOLDER}
                alt=""
                width={800}
                height={800}
                className="rounded-full w-40 h-40 object-cover self-center"
              />
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-semibold">
                  {data.name}
                </h2>
                <h2 className="text-lg md:text-xl text-neutral-600">
                  @{data.username}
                </h2>
                <div className="text-md md:text-lg text-neutral-600 flex flex-row flex-wrap">
                  <div className="flex flex-row gap-1 items-center">
                    <MdArticle />
                    <span className="font-semibold">
                      {data.articles.length}
                    </span>
                    Articles
                  </div>
                  <div className="w-4 " />
                  <div className="flex flex-row gap-1 items-center">
                    <IoMdEye />
                    <span className="font-semibold">{totalViews || 0}</span>
                    Views
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {data.description || "No description yet"}
            </div>
            <div className="text-2xl font-semibold mt-8 mb-4 lg:hidden">
              Top Articles
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:hidden">
              {topArticles?.map((item, index) => (
                <ArticleCardMini
                  key={index}
                  category={item.category}
                  comments={20}
                  views={item.view}
                  date={item.createdAt}
                  image={
                    item.sections.filter((item) => item.type === "Image")[0]
                      ?.content
                  }
                  slug={item.slug}
                  title={item.title}
                  topics={item.topics}
                  description={item.sections
                    .filter((item) => item.type !== "Image")
                    .map((item) => item.content)
                    .join("")}
                  username={username}
                />
              ))}
              {topArticles?.length === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="text-lg md:text-xl">No articles yet</div>
                </div>
              )}
            </div>

            <div className="text-2xl font-semibold mt-8 mb-4">Posted</div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.articles.map((item, index) => (
                <ArticleCardMini
                  key={index}
                  category={item.category}
                  comments={20}
                  views={item.view}
                  date={item.createdAt}
                  image={
                    item.sections.filter((item) => item.type === "Image")[0]
                      ?.content
                  }
                  slug={item.slug}
                  title={item.title}
                  topics={item.topics}
                  description={item.sections
                    .filter((item) => item.type !== "Image")
                    .map((item) => item.content)
                    .join("")}
                  username={username}
                />
              ))}
              {data.articles.length === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="text-lg md:text-xl">No articles yet</div>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/3 lg:w-1/3 xl:w-1/4 h-fit sticky top-0 gap-4 lg:flex flex-col hidden">
            <div className="flex flex-col gap-4 bg-neutral-100 p-4">
              <div className="text-xl font-bold uppercase">Top Articles</div>
              {topArticles?.map((item, index) => (
                <ArticleCardMini
                  key={index}
                  category={item.category}
                  comments={20}
                  views={item.view}
                  date={item.createdAt}
                  image={
                    item.sections.filter((item) => item.type === "Image")[0]
                      ?.content
                  }
                  slug={item.slug}
                  title={item.title}
                  topics={item.topics}
                  description={item.sections
                    .filter((item) => item.type !== "Image")
                    .map((item) => item.content)
                    .join("")}
                  username={username}
                />
              ))}
              {topArticles?.length === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="text-lg md:text-xl">No articles yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AuthorPageClient;
