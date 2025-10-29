import { Navbar } from "./components/Navbar";
import { TypingSmooth } from "./components/ui/TypingSmooth";
import ButtonMain from "./components/ButtonMain";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="w-full px-2 sm:px-4 max-w-screen-xl mx-auto">
        <h1 className="text-white font-sans font-semibold w-full">
          <TypingSmooth />
        </h1>
      </div>
      <div className="mt-8 sm:mt-6 md:mt-8">
        <ButtonMain />
      </div>
    </div>
  );
}
