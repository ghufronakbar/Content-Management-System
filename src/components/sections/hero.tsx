import Link from "next/link";
import Section from "../material/Section";
import Image from "next/image";
import { Information } from "@prisma/client";

interface Props {
  item: Information;
}

export const HeroSection: React.FC<Props> = ({ item }) => {
  const { heroTitle, imageHero, subtitleHero } = item;
  return (
    <Section id="hero" padded>
      <div className="w-full min-h-screen h-full flex flex-col md:flex-row items-center justify-center relative gap-20 md:gap-0">
        <div className="w-full md:w-2/3 lg:w-1/2 h-full flex flex-col gap-8 z-10 min-h-screen justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bely">
            {heroTitle}
          </h1>
          <p className="text-md md:text-lg lg:text-xl text-neutral-600">
            {subtitleHero}
          </p>
          <Link
            className="w-fit h-fit rounded-lg px-4 md:px-8 py-2 md:py-4 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center font-semibold text-sm md:text-base"
            href="/article"
          >
            Start Reading
          </Link>
        </div>
        <div className="w-full md:w-1/2 h-full md:relative absolute">
          <Image
            src={imageHero}
            alt=""
            width={1920}
            height={1080}
            className="w-full h-full object-contain"
          />
          <Image
            src={"/images/shape.png"}
            alt=""
            width={1920}
            height={1080}
            className="w-full h-full object-contain absolute top-0 left-0 -z-10 hidden"
          />
        </div>
      </div>
    </Section>
  );
};
