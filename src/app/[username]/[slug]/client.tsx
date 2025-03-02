"use client";

import { Section as SectionType } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Section from "~/components/material/Section";
import { sortArticleByMatch } from "~/components/page/ArticlePage";
import { DetailArticle } from "~/models/response/article";
import { cn } from "~/utils/cn";
import { formatDate } from "~/utils/formatDate";
import { PLACEHOLDER } from "~/constants/image";
import { MdComment } from "react-icons/md";
import { IoIosArrowForward, IoMdEye } from "react-icons/io";
import Link from "next/link";

interface Props {
  slug: string;
  username: string;
}

const DetailArticleClient: NextPage<Props> = ({ slug, username }) => {
  const [data, setData] = useState<DetailArticle>();
  const [noData, setNoData] = useState<boolean>(false);
  const [articles, setArticles] = useState<DetailArticle[]>([]);

  const moreByAuthor = articles.filter(
    (item) => item.author.username === username && item.slug !== slug
  );

  const router = useRouter();
  const fetchData = async () => {
    try {
      const [resData, resArticles] = await Promise.all([
        axios.get<DetailArticle>(`/api/articles/client/${slug}`),
        axios.get<DetailArticle[]>("/api/articles/client"),
      ]);
      if (resData.data.author.username !== username) {
        router.replace(`/${resData.data.author.username}/${slug}`);
      }
      setData(resData.data);
      const newArticles = sortArticleByMatch(
        resArticles.data,
        resData.data.topics,
        ""
      ).slice(0, 5);
      setArticles(newArticles);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setNoData(true);
        }
      }
    }
  };

  useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [data]);

  if (noData) {
    return notFound();
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <main>
      <Section id="detail-article" padded>
        <div className="w-full min-h-screen container mx-auto flex flex-row gap-2 py-24">
          <div className="w-full md:w-2/3 lg:w-3/4 bg-neutral-100 p-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bely">
              {data.title}
            </h1>
            <div className="flex flex-col gap-4 lg:flex-row md:justify-between my-8">
              <div className="flex flex-col gap-2">
                <div className="bg-red-100 px-2 py-1 rounded-lg text-primary font-medium cursor-pointer text-xs tracking-wider w-fit h-fit">
                  {data.category}
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  {data.topics.map((topic, index) => (
                    <Link
                      key={index}
                      href={`/article?filter=Relevant&search=&category=All%20Categories&topic=${topic}`}
                      className="text-primary cursor-pointer text-sm md:text-base"
                    >
                      #{topic}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-row gap-4 my-8">
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start w-full">
                    <Image
                      src={data.author.image || PLACEHOLDER}
                      alt=""
                      width={400}
                      height={400}
                      className="w-12 h-12 min-w-12 min-h-12 object-cover rounded-full"
                    />
                    <div className="flex flex-col self-center">
                      <div className="text-lg font-semibold line-clamp-1 sm:max-w-[200px] sm:min-w-[200px] text-center sm:text-left">
                        {data.author.name}
                      </div>
                      <div className="text-sm text-neutral-600 text-center sm:text-left">
                        Posted On {formatDate(data.createdAt, true)}
                      </div>
                    </div>
                    <Link
                      className="cursor-pointer border px-4 py-2 rounded-md text-sm drop-shadow-md font-semibold bg-primary text-white text-center h-fit self-center"
                      href={`/${data.author.username}`}
                    >
                      Visit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-neutral-100 p-4 md:hidden mt-4">
              <div className="text-xl font-bold uppercase">
                Table of Content
              </div>
              <TableOfContent items={data.sections} />
            </div>
            <div className="flex flex-col gap-8 mt-12">
              {data.sections.map((section, index) => (
                <ContentSection key={index} {...section} />
              ))}
            </div>
            <div className="flex flex-col gap-4 bg-neutral-100 md:hidden mt-12">
              <div className="text-xl font-bold uppercase">Relevant</div>
              {articles.map((item, index) => (
                <ArticleCard
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
                />
              ))}
            </div>
            {moreByAuthor.length > 0 && (
              <div className="flex flex-col gap-4 bg-neutral-100 md:hidden mt-12">
                <div className="text-xl font-bold uppercase">
                  More By Author
                </div>
                {moreByAuthor.map((item, index) => (
                  <ArticleCard
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
                  />
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/3 lg:w-1/4 h-fit sticky top-0 gap-4 md:flex flex-col hidden">
            <div className="flex flex-col gap-4 bg-neutral-100 p-4">
              <div className="text-xl font-bold uppercase">
                Table of Content
              </div>
              <TableOfContent items={data.sections} />
            </div>
            <div className="flex flex-col gap-4 bg-neutral-100 p-4">
              <div className="text-xl font-bold uppercase">Relevant</div>
              {articles.map((item, index) => (
                <ArticleCard
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
                />
              ))}
            </div>
            {moreByAuthor.length > 0 && (
              <div className="flex flex-col gap-4 bg-neutral-100 p-4">
                <div className="text-xl font-bold uppercase">
                  More By Author
                </div>
                {moreByAuthor.map((item, index) => (
                  <ArticleCard
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
};

const ContentSection = (item: SectionType) => {
  const { content, type } = item;
  let font = "text-lg tracking-wide";

  switch (type) {
    case "H1":
      font = "text-4xl font-bold";
      break;
    case "H2":
      font = "text-3xl font-semibold";
      break;
    case "H3":
      font = "text-2xl font-semibold";
      break;
    case "H4":
      font = "text-xl font-medium";
      break;
    case "H5":
      font = "text-lg font-medium";
      break;
    case "H6":
      font = "text-lg font-medium";
      break;
    case "Text":
      font = "text-md tracking-wide";
      break;
    case "List":
      font = "text-md";
      break;
    case "Number":
      font = "text-md";
      break;
    case "Quote":
      font = "text-2xl md:text-4xl font-neutral-600";
      break;
    default:
  }

  if (type === "Image") {
    return (
      <div className="w-full md:w-1/2 lg:w-1/3 h-fit mx-auto" id={item.content}>
        <Image
          src={content}
          alt=""
          width={1000}
          height={500}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    );
  }

  if (type === "Quote") {
    return (
      <div
        className={cn(
          "w-full md:w-1/2 lg:w-2/3 h-fit mx-auto font-bely text-center text-4xl text-neutral-600"
        )}
        id={item.content}
      >
        &quot;{content}&quot;
      </div>
    );
  }

  if (type === "Number") {
    const contents: string[] = content.split("\n");
    return (
      <div className={cn("w-full flex flex-col gap-2")} id={item.content}>
        {contents.map((content, index) => (
          <div key={index} className={font}>
            {index + 1}. {content}
          </div>
        ))}
      </div>
    );
  }

  if (type === "List") {
    const contents: string[] = content.split("\n");
    return (
      <div className={cn("w-full flex flex-col gap-2")} id={item.content}>
        {contents.map((content, index) => (
          <div key={index} className={font}>
            - {content}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={font} id={item.content}>
      {content}
    </div>
  );
};

export default DetailArticleClient;

interface PropsTOC {
  items: SectionType[];
}

const TableOfContent: FC<PropsTOC> = ({ items }) => {
  const H = ["H1", "H2", "H3", "H4", "H5", "H6"];
  const classNames = [
    "text-base md:text-2xl",
    "text-sm md:text-xl ml-2",
    "text-xs md:text-lg ml-4",
    "text-[0.8125rem] md:text-md ml-6",
    "text-[0.75rem] md:text-base ml-8",
  ];
  const filteredItems = items.filter((item) => H.includes(item.type));

  const getClassName = (h: string) => {
    switch (h) {
      case "H1":
        return classNames[0];
      case "H2":
        return classNames[1];
      case "H3":
        return classNames[2];
      case "H4":
        return classNames[3];
      case "H5":
        return classNames[4];
      default:
        return classNames[4];
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {filteredItems.map((item, index) => (
        <Link key={index} href={`#${item.content}`}>
          <div
            className={cn(
              "text-neutral-700 flex flex-row gap-1 font-medium",
              getClassName(item.type)
            )}
          >
            <p className="text-primary font-bold cursor-pointer">
              #{item.type.slice(1, 2)}
            </p>{" "}
            {item.content}
          </div>
        </Link>
      ))}
    </div>
  );
};

interface PropsArticle {
  image?: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  topics: string[];
  date: string | Date;
  comments: number;
  views: number;
}

const ArticleCard: FC<PropsArticle> = ({
  image,
  category,
  title,
  description,
  slug,
  topics,
  date,
  comments,
  views,
}) => {
  return (
    <Link href={`/article/${slug}`}>
      <div className="flex flex-col  w-full h-fit gap-4 text-neutral-600">
        <div className="w-full flex flex-col gap-4">
          <Image
            src={image || PLACEHOLDER}
            alt=""
            width={810}
            height={540}
            className="w-full h-auto aspect-video object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-red-100 px-2 py-1 rounded-lg text-primary font-medium cursor-pointer text-xs tracking-wider w-fit h-fit">
            {category}
          </div>
          <h4 className="text-2xl font-bold line-clamp-1 text-neutral-900">
            {title}
          </h4>
          <p className="line-clamp-3">{description}</p>
          <div>
            <p className="font-medium">{topics.join(", ")}</p>
            <p className="text-sm">Posted On {formatDate(date, true)}</p>
          </div>
          <div className="flex flex-row justify-between items-center mt-4 flex-wrap gap-2">
            <div className="flex flex-row gap-4 items-center flex-wrap">
              <div className="flex flex-row gap-2 items-center">
                <MdComment className="w-6 h-6 text-neutral-600" />
                {comments} Comments
              </div>
              <div className="flex flex-row gap-2 items-center">
                <IoMdEye className="w-6 h-6 text-neutral-600" />
                {views} Views
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center text-primary cursor-pointer">
              Read More
              <IoIosArrowForward className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
