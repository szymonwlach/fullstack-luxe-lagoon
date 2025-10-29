"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <span
                key={`char-${index}`}
                className={cn("dark:text-white text-black", word.className)}
              >
                {char}
              </span>
            ))}
            &nbsp;
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      {/* Surowy tekst na małych ekranach */}
      <div className="block md:hidden text-lg sm:text-xl font-bold">
        {words.map((word) => (
          <span key={word.text} className={cn(word.className)}>
            {word.text}{" "}
          </span>
        ))}
      </div>

      {/* Animacja tylko dla md i większych */}
      <div className="hidden md:flex space-x-1">
        <motion.div
          className="overflow-hidden pb-2"
          initial={{ width: "0%" }}
          whileInView={{ width: "fit-content" }}
          transition={{ duration: 2, ease: "linear", delay: 1 }}
        >
          <div className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold whitespace-nowrap">
            {renderWords()}
          </div>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "block rounded-sm w-[4px] h-3 sm:h-4 md:h-6 xl:h-12 bg-yellow-500",
            cursorClassName
          )}
        ></motion.span>
      </div>
    </div>
  );
};
