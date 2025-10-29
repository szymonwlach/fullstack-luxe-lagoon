import React from "react";
import { Navbar } from "../components/Navbar";
import AddHotelForm from "../components/AddHotelForm";

const page = () => {
  return (
    <div>
      <div className="grid grid-cols-5 max-lg:gap-x-8 lg:gap-x-24 max-md:gap-y-16 md:gap-y-32 text-lg items-center">
        <Navbar />
      </div>
      <div className="mt-48">
        <AddHotelForm />
      </div>
    </div>
  );
};

export default page;
