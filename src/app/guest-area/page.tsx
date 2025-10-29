import React from "react";
import IsLogged from "./components/IsLogged";
import Navbar from "../components/Navbar";

const page = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <IsLogged />
    </div>
  );
};

export default page;
