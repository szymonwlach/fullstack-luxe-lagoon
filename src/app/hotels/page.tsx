import React from "react";
import { Navbar } from "../components/Navbar";
import { Show } from "./components/Show";

const page = () => {
  return (
    <div>
      <div className=" bg-slate-800 w-full">
        <Navbar />
      </div>
      <div className="flex flex-col w-5/6 mt-28 mx-auto">
        <h1 className="text-yellow-600 text-5xl ml-32 mb-4 -mt-5">
          Our Luxury Hotels
        </h1>
        <p className="text-slate-300 text-xl ml-32 mt-5 m-8">
          Luxury beachfront hotels offer the perfect escape with stunning ocean
          views, soft sand, and the soothing sound of waves. Exclusive suites,
          private pools, and world-class service ensure pure indulgence. From
          spa treatments to sunset dinners, every detail is designed for
          ultimate relaxation. Experience paradise in unmatched comfort and
          elegance.
        </p>
      </div>
      <div className="w-full border-2">
        <Show />
      </div>
    </div>
  );
};

export default page;
