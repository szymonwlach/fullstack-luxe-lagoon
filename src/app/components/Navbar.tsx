"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

interface NavigationLinksProps {
  className?: string;
  onClick?: () => void;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({
  className = "",
  onClick = () => {},
}) => {
  const { user } = useUser(); // Teraz poprawnie w Hooku

  return (
    <div className={`flex items-center space-x-8 ${className}`}>
      <Link href="/hotels" onClick={onClick}>
        <span className="font-serif text-neutral-200 hover:text-yellow-500 duration-150 text-lg">
          Hotels
        </span>
      </Link>

      {user && (
        <Link href="/addHotel" onClick={onClick}>
          <span className="font-serif text-neutral-200 hover:text-yellow-500 duration-150 text-lg">
            Add Hotel
          </span>
        </Link>
      )}

      <Link
        href="/guest-area"
        onClick={onClick}
        className="flex items-center space-x-2"
      >
        <span className="font-serif text-neutral-200 hover:text-yellow-500 duration-150 text-lg">
          Guest Area
        </span>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Link>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full lg:w-[95%] flex items-center justify-between px-6 lg:px-12 rounded-b-xl
      ${
        isHome ? "bg-transparent" : "bg-slate-800 bg-opacity-90 shadow-md h-20"
      } transition-all duration-300 z-50`}
    >
      {/* Logo Section */}
      <Link href="/" className="flex items-center space-x-3">
        <Image
          src="/logoLuxury2Final.png"
          width={80}
          height={80}
          alt="logo"
          priority
          className="w-16 h-16 lg:w-20 lg:h-20"
        />
        <span className="text-xl lg:text-2xl font-semibold text-neutral-200">
          Luxe Lagoon
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center">
        <NavigationLinks />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-neutral-200">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-slate-800 border-none text-white">
            <SheetHeader>
              <SheetTitle className="text-neutral-200">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col space-y-4">
              <NavigationLinks
                className="text-center"
                onClick={() => setIsOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
