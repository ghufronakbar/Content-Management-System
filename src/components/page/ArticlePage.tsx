"use client";

import AuthorCard from "~/components/material/AuthorCard";
import ArticleCard from "~/components/material/ArticleCard";
import Section from "../material/Section";
import { FC, FormEvent, useEffect, useState } from "react";
import { cn } from "~/utils/cn";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DetailArticle } from "~/models/response/article";
import axios from "axios";
import { DetailUser } from "~/models/response/user";
import LoadingPage from "~/app/loading";

const FILTER_SORT = ["Relevant", "Latest", "Popular"];

interface Props {
  isLandingPage?: boolean;
}

const ArticlePage: FC<Props> = ({ isLandingPage }) => {
  const {
    category,
    filter,
    onCategory,
    onFilter,
    onSearch,
    search,
    topic,
    onTopic,
    goToArticle,
  } = useFilterArticle();

  const [data, setData] = useState<DetailArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [authors, setAuthors] = useState<DetailUser[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<DetailArticle[]>("/api/articles/client");
      setData(response.data);
      const uniqueCategories = Array.from(
        new Set(response.data.map((item) => item.category))
      );
      const uniqueTopics = Array.from(
        new Set(response.data.flatMap((item) => item.topics))
      );
      setCategories(["All Categories", ...uniqueCategories]);
      setTopics(uniqueTopics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get<DetailUser[]>("/api/authors");
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAuthors();
  }, []);

  const filterCategory = (isLandingPage ? data.slice(0, 5) : data).filter(
    (item) =>
      category === "All Categories" ? true : item.category === category
  );
  const filterSearch = sortArticleByMatch(filterCategory, [topic], search);

  const filterSort = () => {
    switch (filter) {
      case "Relevant":
        return filterSearch.sort((a, b) => b.points - a.points);
      case "Latest":
        return filterSearch.sort(
          (a, b) =>
            Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
        );
      case "Popular":
        return filterSearch.sort((a, b) => b.view - a.view);
      default:
        return filterSearch;
    }
  };

  const filteredData = filterSort();

  if (loading) return <LoadingPage />;

  return (
    <Section id="article" padded>
      <div className="w-full h-full min-h-screen flex flex-col gap-4">
        <div className="flex flex-row gap-4 justify-center flex-wrap">
          {categories.map((item, index) => (
            <div
              className={cn(
                "w-fit h-fit rounded-3xl px-4 py-2 text-neutral-800  transition-all flex flex-row gap-2 items-center font-semibold text-sm md:text-base cursor-pointer",
                category === item && "bg-primary text-white"
              )}
              key={index}
              onClick={() => onCategory(item)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="w-full h-[1px] bg-neutral-200 my-4" />
        <div className="w-full min-h-screen flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 xl:w-3/4 md:overflow-auto md:h-[90vh] hide-scrollbar">
            <div className="flex flex-col gap-8">
              {filteredData.map((item, index) => (
                <ArticleCard
                  key={index}
                  category={item.category}
                  comments={20}
                  date={item.createdAt}
                  description={item.sections
                    .filter((item) => item.type !== "Image")
                    .map((item) => item.content)
                    .join(". ")}
                  slug={item.slug}
                  title={item.title}
                  topics={item.topics}
                  views={item.view}
                  author={item.author}
                  image={
                    item.sections.find((item) => item.type === "Image")?.content
                  }
                />
              ))}
              {filteredData.length === 0 && (
                <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
                  <p className="text-2xl text-neutral-600 font-medium">
                    No articles found :(
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4 sticky top-0 gap-8 flex flex-col">
            <div className="w-full flex flex-col bg-neutral-100 p-4 gap-4 rounded-md">
              <p className="text-lg text-neutral-900 font-bold uppercase mt-2">
                Sort By
              </p>
              <div className="flex flex-row flex-wrap gap-4 w-full">
                {FILTER_SORT.map((item, index) => (
                  <p
                    className={cn(
                      "cursor-pointer",
                      filter === item && "text-primary font-medium"
                    )}
                    onClick={() => onFilter(item)}
                    key={index}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <form
              className="w-full flex flex-col bg-neutral-100 p-4 gap-4 rounded-md"
              onSubmit={goToArticle}
            >
              <input
                type="text"
                placeholder="How to become a better writer"
                className="w-full px-4 py-4 rounded-lg drop-shadow-sm bg-white border border-neutral-200 focus:outline-none"
                onChange={(e) => onSearch(e.target.value)}
                value={search}
              />
              <p className="text-lg text-neutral-900 font-bold uppercase mt-2">
                Recommended Topics
              </p>
              <div className="flex flex-row flex-wrap gap-4 w-full">
                {topics.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "bg-red-100 p-2 rounded-lg text-primary font-medium cursor-pointer text-sm tracking-wider",
                      topic === item && "bg-primary text-white"
                    )}
                    onClick={() => onTopic(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </form>
            <div className="w-full flex flex-col bg-neutral-100 p-4 gap-4 rounded-md">
              <p className="text-lg text-neutral-900 font-bold uppercase mt-2">
                Top Authors
              </p>
              <div className="flex flex-col flex-wrap gap-4 w-full">
                {authors.map((item, index) => (
                  <AuthorCard
                    username={item.username}
                    articles={item._count.articles}
                    key={index}
                    image={item.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const useFilterArticle = () => {
  const [filter, setFilter] = useState<string>("Relevant");
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All Categories");
  const [topic, setTopic] = useState<string>("");
  const pathname = usePathname();
  const searchParams = `?filter=${filter}&search=${search}&category=${category}&topic=${topic}`;
  const router = useRouter();

  const sp = useSearchParams();
  const spFilter = sp.get("filter") || "Relevant";
  const spSearch = sp.get("search") || "";
  const spCategory = sp.get("category") || "All Categories";
  const spTopic = sp.get("topic") || "";

  useEffect(() => {
    window.history.replaceState(null, "", pathname + searchParams);
  }, [pathname, searchParams]);

  useEffect(() => {
    setFilter(spFilter);
    setSearch(spSearch);
    setCategory(spCategory);
    setTopic(spTopic);
  }, [spFilter, spSearch, spCategory, spTopic]);

  const onFilter = (value: string) => {
    setFilter(value);
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onCategory = (value: string) => {
    setCategory(value);
  };

  const onTopic = (value: string) => {
    if (value === topic) {
      setTopic("");
    } else {
      setTopic(value);
    }
  };

  const goToArticle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/article" + searchParams);
  };

  return {
    filter,
    search,
    category,
    onFilter,
    onSearch,
    onCategory,
    topic,
    onTopic,
    searchParams,
    goToArticle,
  };
};

interface DetailArticleWithPoints extends DetailArticle {
  points: number;
}

export const sortArticleByMatch = (
  data: DetailArticle[],
  topics: string[],
  search: string
): DetailArticleWithPoints[] => {
  const filteringWithTopics: DetailArticleWithPoints[] = data.map((item) => ({
    ...item,
    points: item.topics.filter((topic) => topics.includes(topic)).length * 3,
  }));
  const filteringWithSearch: DetailArticleWithPoints[] =
    filteringWithTopics.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  let isTopicClick = false;
  if (topics[0] !== "") {
    isTopicClick = true;
  }
  const filteredData = filteringWithSearch
    .sort((a, b) => b.points - a.points)
    .filter((item) => (isTopicClick ? item.points > 0 : true));
  return filteredData;
};

export default ArticlePage;
