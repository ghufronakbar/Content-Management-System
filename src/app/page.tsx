import { Metadata } from "next";
import ArticlePage from "~/components/page/ArticlePage";
import { GreetSection } from "~/components/sections/greet";
import { HeroSection } from "~/components/sections/hero";
import { TestimonialSection } from "~/components/sections/authors";
import { FeatureSection } from "~/components/sections/features";
import { BASE_URL } from "~/constants";

export const metadata = async (): Promise<Metadata> => {
  const information = await getInformation();
  return {
    title: "Socio Engineer",
    description: information?.subtitleHero,
    openGraph: {
      title: "Socio Engineer",
      description: information?.subtitleHero,
      images: [information?.imageHero || ""],
    },
  };
};

const getUsers = async () => {
  return await fetch(BASE_URL + "/api/authors", {
    next: { revalidate: 60 },
  }).then((res) => res.json());
};

const getInformation = async () => {
  const informations = await fetch(BASE_URL + "/api/information", {
    next: { revalidate: 60 },
  }).then((res) => res.json());
  return informations;
};

const getFeatures = async () => {
  return await fetch(BASE_URL + "/api/feature", {
    next: { revalidate: 60 },
  }).then((res) => res.json());
};

export default async function Home() {
  const [users, information, features] = await Promise.all([
    getUsers(),
    getInformation(),
    getFeatures(),
  ]);
  return (
    <main className="!overflow-x-hidden">
      <HeroSection item={information} />
      <GreetSection item={information} />
      <FeatureSection item={information} carousels={features} />
      <TestimonialSection items={users} />
      <ArticlePage isLandingPage />
    </main>
  );
}
