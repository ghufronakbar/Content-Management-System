import { Metadata } from "next";
import ArticlePage from "~/components/page/ArticlePage";
import { GreetSection } from "~/components/sections/greet";
import { HeroSection } from "~/components/sections/hero";
import { TestimonialSection } from "~/components/sections/authors";
import prisma from "~/config/prisma";
import { FeatureSection } from "~/components/sections/features";

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
  return await prisma.user.findMany({
    select: {
      name: true,
      title: true,
      description: true,
      image: true,
    },
  });
};

const getInformation = async () => {
  const informations = await prisma.information.findMany();
  return informations[0];
};

const getFeatures = async () => {
  return await prisma.feature.findMany();
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
