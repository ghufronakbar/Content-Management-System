import { Article, Section } from "@prisma/client";

export interface DetailArticle extends Article {
  sections: Section[];
}
