import { Metadata } from "next";
import ArticlePage from "~/components/page/ArticlePage";
import { BASE_URL } from "~/constants";

const getInformation = async () => {
  const informations = await fetch(BASE_URL + "/api/information", {
    next: { revalidate: 60 },
  }).then((res) => res.json());
  return informations;
};

export const metadata = async (): Promise<Metadata> => {
  const information = await getInformation();
  return {
    title: "Article | Socio Engineer",
    description: information?.subtitleHero,
    openGraph: {
      title: "Socio Engineer",
      description: information?.subtitleHero,
      images: [information?.imageHero || ""],
    },
  };
};

const Article = () => {
  return (
    <div className="w-full pt-24 min-h-screen">
      <div className="w-full min-h-screen">
        <ArticlePage />
      </div>
    </div>
  );
};

export default Article;
