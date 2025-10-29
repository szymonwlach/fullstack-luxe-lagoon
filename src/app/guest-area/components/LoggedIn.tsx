"use client";
import React, { useEffect, useState } from "react";
import ShowUserInfo from "./ShowUserInfo";

interface UserDataIntf {
  id: string;
  email: string;
  createdAt: string;
  username: string;
  role: string;
}

const LoggedIn = ({ userId }: { userId: string }) => {
  const [userData, setUserData] = useState<UserDataIntf | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/GetUserData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`Błąd pobierania danych: ${response.status}`);
        }

        const data: UserDataIntf = await response.json();

        setUserData(data);
      } catch (error) {
        console.error("❌ error while getting a user:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="w-screen h-screen flex items-center justify-center text-center mt-20">
      {userData ? (
        <ShowUserInfo userData={userData} />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-200 text-lg">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default LoggedIn;
