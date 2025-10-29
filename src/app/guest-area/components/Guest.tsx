import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import React from "react";

const Guest = () => {
  return (
    <div className="w-screen h-screen text-center overflow-hidden">
      <div className="w-1/3 mx-auto m-4">
        <h1 className="text-slate-200 mx-auto mt-52 text-3xl my-12">
          Log in to enter the guest area
        </h1>
        <SignInButton>
          <Button className=" py-6 text-lg bg-blue-600 hover:bg-blue-700">
            Log in
          </Button>
        </SignInButton>
      </div>
    </div>
  );
};

export default Guest;
