"use client";

import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { MdAdd, MdMenu } from "react-icons/md";
import { toast } from "react-toastify";
import DashboardLayout from "~/components/material/DashboardLayout";
import { PLACEHOLDER } from "~/constants/image";
import { DetailArticle } from "~/models/response/article";
import { cn } from "~/utils/cn";
import { formatDate } from "~/utils/formatDate";
import { optToast } from "~/utils/toast";

const UserArticlePageClient: NextPage = () => {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<DetailArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    fetchData();
  }, []);

  if (session?.user.role !== "Admin" && status !== "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<DetailArticle[]>("/api/articles");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredArticles = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClickMenu = (id: number) => {
    if (menuOpen === id) {
      setMenuOpen(null);
    } else {
      setMenuOpen(id);
    }
  };

  const onMenuEnter = (id: number) => {
    if (menuOpen !== id) {
      setMenuOpen(id);
    }
  };

  const onHandleAccept = async (id: string, acc: boolean) => {
    try {
      setMenuOpen(null);
      toast("Loading...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      const res = await axios.patch(`/api/articles/${id}/accept`, {
        accept: acc,
      });
      await fetchData();
      toast(res?.data?.toString(), {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      if (error instanceof AxiosError) {
        toast(error.response?.data, {
          ...optToast,
          type: "error",
          position: "bottom-right",
          autoClose: 3000,
        });
      } else if (error instanceof Error) {
        toast(error.message, {
          ...optToast,
          type: "error",
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <DashboardLayout
      title="All Articles"
      childrenHeader={
        <div className="flex gap-4">
          <Link href="/dashboard/create">
            <button className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center">
              <MdAdd />
              Add
            </button>
          </Link>
        </div>
      }
    >
      <div className="flex flex-col space-y-2 w-full md:w-1/3">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Cari
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {filteredArticles.map((item, index) => (
          <ListArticle
            article={item}
            key={item.id}
            isMenuOpen={menuOpen === index}
            onClickMenu={() => onClickMenu(index)}
            onMenuEnter={() => onMenuEnter(index)}
            onMenuLeave={() => setMenuOpen(null)}
            onHandleAccept={onHandleAccept}
            user={session?.user}
          />
        ))}
      </div>
      {!loading && filteredArticles.length === 0 && (
        <div className="text-center text-neutral-600 text-lg mx-auto mt-4">
          There&apos;s no article{search && " with keyword " + `"${search}"`}
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserArticlePageClient;

interface ListArticleProps {
  article: DetailArticle;
  isMenuOpen: boolean;
  onClickMenu: () => void;
  onHandleAccept: (id: string, acc: boolean) => void;
  onMenuEnter: MouseEventHandler<HTMLDivElement>;
  onMenuLeave: MouseEventHandler<HTMLDivElement>;
  user?: User;
}

const ListArticle: FC<ListArticleProps> = ({
  article,
  isMenuOpen,
  onClickMenu,
  onHandleAccept,
  onMenuEnter,
  onMenuLeave,
  user,
}) => {
  return (
    <div className="w-full rounded-lg shadow-lg p-4 border border-neutral-200 flex flex-col md:flex-row gap-4">
      <Image
        src={
          article?.sections.filter((s) => s.type === "Image")?.[0]?.content ||
          PLACEHOLDER
        }
        alt=""
        width={400}
        height={400}
        className="w-full md:w-40 h-40 object-cover rounded-lg md:aspect-square"
      />
      <div className="w-full flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-col w-fit">
              <div className="font-bold text-xl line-clamp-1">
                {article.title}
              </div>
              <div className="font-medium line-clamp-1">{article.category}</div>
            </div>
            <div
              className="cursor-pointer relative"
              onClick={onClickMenu}
              onMouseEnter={onMenuEnter}
              onMouseLeave={onMenuLeave}
            >
              <MdMenu className="w-6 h-6 cursor-pointer" />
              {isMenuOpen && (
                <div className="absolute flex flex-col right-0 top-8 border border-neutral-200 rounded-lg overflow-hidden z-50 bg-white shadow-md w-40">
                  {article.status !== "Confirmed" &&
                  user?.username === article.author.username ? (
                    <>
                      <div
                        className="border border-neutral-200 px-4 py-1 text-center hover:bg-neutral-100"
                        onClick={() => onHandleAccept(article.id, true)}
                      >
                        Confirm
                      </div>

                      <div
                        className="border border-neutral-200 px-4 py-1 text-center hover:bg-neutral-100"
                        onClick={() => onHandleAccept(article.id, false)}
                      >
                        Reject
                      </div>
                    </>
                  ) : user?.username !== article.author.username &&
                    article.author.role === "Admin" ? (
                    <div
                      className="border border-neutral-200 px-4 py-1 text-center hover:bg-neutral-100"
                      onClick={() =>
                        onHandleAccept(
                          article.id,
                          article.status === "Confirmed" ? false : true
                        )
                      }
                    >
                      {article.status === "Confirmed" ? "Reject" : "Confirm"}
                    </div>
                  ) : (
                    <Link
                      className="border border-neutral-200 px-4 py-1 text-center hover:bg-neutral-100"
                      href={`/dashboard/article/${article.id}`}
                    >
                      Edit
                    </Link>
                  )}
                  <Link
                    href={`/${article.author.username}/${article.slug}`}
                    className="border border-neutral-200 px-4 py-1 text-center hover:bg-neutral-100"
                    target="_blank"
                  >
                    Preview
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm line-clamp-3 text-neutral-700">
            {article?.sections
              .filter((s) => s.type !== "Image")
              ?.map((s) => s.content)
              .join("")}
          </div>
        </div>
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-2 xl:gap-0 mt-2 xl:mt-0">
          <div className="flex flex-row gap-2 items-center">
            <div className="font-medium flex flex-row gap-2 items-center">
              <IoMdEye /> {article.view} Views
            </div>
            {article.status === "Confirmed" ? (
              <div
                className={cn(
                  "px-2 py-1 rounded-lg text-white text-xs flex items-center",
                  article.published ? "bg-green-500" : "bg-gray-500"
                )}
              >
                {article.published ? "Published" : "Draft"}
              </div>
            ) : (
              <div
                className={cn(
                  "px-2 py-1 rounded-lg text-white text-xs flex items-center",
                  article.status === "Pending" ? "bg-gray-500" : "bg-red-500"
                )}
              >
                {article.status}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            {user?.username === article.author.username && (
              <div className="flex flex-row gap-2 items-center text-xs">
                Your Article
              </div>
            )}
            <div className="text-xs text-neutral-500">
              Last Updated {formatDate(article.updatedAt, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
