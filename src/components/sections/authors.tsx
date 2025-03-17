import { AnimatedTestimonials } from "~/components/ui/animated-testimonials";

interface Props {
  items: {
    description: string;
    name: string;
    title: string;
    image: string | null;
  }[];
}

export const TestimonialSection: React.FC<Props> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bely">
        Our Authors
      </h2>
      <AnimatedTestimonials users={items} />
    </div>
  );
};
