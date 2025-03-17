import { Information } from "@prisma/client";
import Section from "../material/Section";
import { TextGenerateEffect } from "../ui/text-generate-effect";

interface Props {
  item: Information;
}

export const GreetSection: React.FC<Props> = ({ item }) => {
  const { greetText, greetTitle } = item;
  return (
    <Section id="greet" padded>
      <div className="flex flex-col w-full h-full min-h-screen items-center justify-center gap-8">
        <TextGenerateEffect
          className="text-3xl md:text-4xl lg:text-5xl font-bely text-center"
          words={greetTitle}
        />
        <div className="text-sm md:text-md lg:text-lg text-neutral-600 text-center">
          <TextGenerateEffect
            className="font-normal text-center text-neutral-600"
            words={greetText}
          />
        </div>
      </div>
    </Section>
  );
};
