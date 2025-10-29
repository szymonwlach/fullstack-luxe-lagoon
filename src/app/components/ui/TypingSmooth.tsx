"use client";
import { TypewriterEffectSmooth } from "./typewriter-effect";

export function TypingSmooth() {
  const words = [
    {
      text: "Welcome",
      className: "text-neutral-200",
    },
    {
      text: "to",
      className: "text-neutral-200",
    },
    {
      text: "Luxe",
      className: "text-yellow-500 dark:text-yellow-500",
    },
    {
      text: "Lagoon",
      className: "text-yellow-500 dark:text-yellow-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full py-4 px-2 mt-24 sm:mt-20 md:mt-28 lg:mt-36">
      <p className="text-neutral-200 dark:text-neutral-200 text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 text-center mb-2 sm:mb-4 mt-12">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}
