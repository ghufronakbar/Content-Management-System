import { FC, ReactNode } from "react";
import { cn } from "~/utils/cn";

interface Props {
  id: string;
  children: ReactNode;
  padded?: boolean;
  className?: string;
}
const Section: FC<Props> = ({ id, children, padded, className }) => {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen w-full bg-neutral-50 flex",
        padded && "px-8 md:px-12 lg:px-18",
        className
      )}
    >
      {children}
    </section>
  );
};

export default Section;
