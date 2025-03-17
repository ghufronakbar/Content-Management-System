import { Feature, Information } from "@prisma/client";
import { Carousel, Card } from "~/components/ui/apple-cards-carousel";

interface Props {
  item: Information;
  carousels: Feature[];
}

export const FeatureSection: React.FC<Props> = ({ item, carousels }) => {
  const { featureTitle } = item;
  const cards = carousels.map((card, index) => (
    <Card key={card.image} card={card} index={index} />
  ));
  return (
    <section id="animal" className="w-full min-h-screen md:py-32">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 font-sans">
        {featureTitle}
      </h2>
      <Carousel items={cards} />
    </section>
  );
};
