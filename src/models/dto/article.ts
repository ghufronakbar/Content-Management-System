import { SectionType } from "@prisma/client";

export interface SectionDTO {
  content: string;
  picture: File | null;
  type: SectionType;
}

export interface ArticleDTO {
  slug: string;
  title: string;
  category: string;
  published: boolean;
  topics: string[];
  sections: SectionDTO[];
}

export const initSectionDTO: SectionDTO = {
  content: "",
  type: "H1",
  picture: null,
};

export const initArticleDTO: ArticleDTO = {
  slug: "",
  title: "",
  category: "",
  topics: [],
  published: false,
  sections: [initSectionDTO],
};
