"use client";

import Image from "next/image";
import { FC } from "react";
import { formatDate } from "~/utils/formatDate";
import { PLACEHOLDER } from "~/constants/image";
// import { MdComment } from "react-icons/md";
import { IoIosArrowForward, IoMdEye } from "react-icons/io";
import Link from "next/link";

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
  username: string;
}

const ArticleCardMini: FC<PropsArticle> = ({
  image,
  category,
  title,
  description,
  slug,
  topics,
  date,
  // comments,
  views,
  username,
}) => {
  return (
    <Link href={`/${username}/${slug}`}>
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
              {/* <div className="flex flex-row gap-2 items-center">
                <MdComment className="w-6 h-6 text-neutral-600" />
                {comments} Comments
              </div> */}
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
export default ArticleCardMini;
