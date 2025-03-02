import Image from "next/image";
import Link from "next/link";
import Section from "~/components/material/Section";
import ArticlePage from "~/components/page/ArticlePage";

export default function Home() {
  return (
    <main className="!overflow-x-hidden">
      <Section id="hero" padded>
        <div className="w-full min-h-screen h-full flex flex-col md:flex-row items-center justify-center relative gap-20 md:gap-0">
          <div className="w-full md:w-2/3 lg:w-1/2 h-full flex flex-col gap-8 z-10 min-h-screen justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bely">
              Make Experience into Typography
            </h1>
            <p className="text-md md:text-lg lg:text-xl text-neutral-600">
              Learn and grow by drawing wisdom from the experiences of others.
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
              src={"/images/hero.png"}
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
              className="w-full h-full object-contain absolute top-0 left-0 -z-10"
            />
          </div>
        </div>
      </Section>
      <Section id="greet" padded>
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center gap-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bely text-center">
            Reimagining what it means to work
          </h2>
          <div className="text-sm md:text-md lg:text-lg text-neutral-600 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            suscipit eos numquam culpa, quos recusandae. Aliquam temporibus
            pariatur voluptate asperiores?
          </div>
        </div>
      </Section>
      <ArticlePage isLandingPage />
    </main>
  );
}
