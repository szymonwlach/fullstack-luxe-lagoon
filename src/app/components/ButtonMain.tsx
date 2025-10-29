"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ButtonMain = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 640) {
      // Jeśli ekran jest mały, pokaż przycisk od razu
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      <Link href="/hotels">
        <Button
          className={`bg-yellow-600 w-56 h-16 -mt-8 after:border-2 before:border-2 hover:bg-amber-600 text-xl transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Explore luxury Hotels
        </Button>
      </Link>
    </div>
  );
};

export default ButtonMain;
