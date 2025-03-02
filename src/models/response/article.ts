import { Article, Section, User } from "@prisma/client";

export interface DetailArticle extends Article {
  sections: Section[];
  author: User;
}
