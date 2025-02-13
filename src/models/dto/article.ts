import { SectionType } from "@prisma/client";

export interface SectionDTO {
  content: string;
  picture: File | null;
  type: SectionType;
}

export interface ArticleDTO {
  slug: string;
  title: string;
  published: boolean;
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
  published: false,
  sections: [initSectionDTO],
};
