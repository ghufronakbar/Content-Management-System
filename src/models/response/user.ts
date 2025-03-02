import { User } from "@prisma/client";
import { DetailArticle } from "./article";

export interface DetailUser extends User {
  _count: { articles: number };
  articles: DetailArticle[];
}
