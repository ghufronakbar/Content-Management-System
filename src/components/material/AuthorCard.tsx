import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { PLACEHOLDER } from "~/constants/image";

interface Props {
  image?: string | null;
  username: string;
  articles: string | number;
}

const AuthorCard: FC<Props> = ({ image, username, articles }) => {
  return (
    <Link href={`/${username}`}>
      <div className="p-2 rounded-lg font-medium cursor-pointer text-sm tracking-wider flex flex-row justify-between gap-2 group">
        <div className="flex flex-row gap-2">
          <Image
            src={image || PLACEHOLDER}
            alt=""
            width={40}
            height={40}
            className="rounded-full h-full w-auto aspect-square object-cover"
          />
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-neutral-900 text-base line-clamp-1 group-hover:underline">
              {username}
            </p>
            <p className="text-xs text-neutral-600 line-clamp-1">{articles} Articles</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-lg border border-neutral-200 text-xs w-fit h-fit">
          Visit
        </div>
      </div>
    </Link>
  );
};

export default AuthorCard;
