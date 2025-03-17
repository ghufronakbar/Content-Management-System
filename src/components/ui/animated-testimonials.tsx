"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Section from "../material/Section";
import { PLACEHOLDER } from "~/constants/image";

type UserTestimonial = {
  description: string;
  name: string;
  title: string;
  image: string | null;
};
export const AnimatedTestimonials = ({
  users: users,
  autoplay = true,
}: {
  users: UserTestimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % users.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + users.length) % users.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <Section id="authors">
      <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
        <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
          <div>
            <div className="relative h-80 w-full">
              <AnimatePresence>
                {users.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.image}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index) ? 40 : users.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <Image
                      src={testimonial.image || PLACEHOLDER}
                      alt={testimonial.name}
                      width={800}
                      height={800}
                      draggable={false}
                      className="w-72 h-72 min-w-72 min-h-72 rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col justify-between py-4">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-2xl font-bold text-black">
                {users[active].name}
              </h3>
              <p className="text-sm text-gray-500">{users[active].title}</p>
              <motion.p className="mt-8 text-lg text-gray-500">
                {users[active].description.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                onClick={handlePrev}
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 "
              >
                <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 " />
              </button>
              <button
                onClick={handleNext}
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 "
              >
                <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
