import React, { useState } from "react";
import { DialogComponent } from "./Dialog";
import { toast } from "sonner";
import { z } from "zod"; // Zaimportuj zod
import { ShowBooking } from "./ShowBooking";

interface UserDataIntf {
  id: string;
  email: string;
  createdAt: string;
  username: string;
  role: string;
}

const ShowUserInfo = ({ userData }: { userData: UserDataIntf }) => {
  const [displayUsername, setDisplayUsername] = useState(
    userData?.username || ""
  );

  const usernameSchema = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." });

  const handleUsernameUpdate = (newName: string) => {
    const result = usernameSchema.safeParse(newName);

    if (result.success) {
      setDisplayUsername(newName);
      toast.success("Your username has been successfully updated!", {
        style: { backgroundColor: "#86efac", color: "#14532d" },
      });
    } else {
      toast.error(result.error.errors[0].message, {
        style: { backgroundColor: "#fca5a5", color: "#9b1d20" },
      });
    }
  };

  if (!userData) {
    return <p>There is no user</p>;
  }

  return (
    <div className="w-full overflow-scroll h-full">
      <h1 className="flex flex-row text-slate-200 text-3xl text-start md:ml-12 md:mt-12 flex-wrap mt-12 ml-2">
        Welcome,&nbsp;
        <span className="text-amber-400">{displayUsername}</span>
        <DialogComponent
          usernameSend={displayUsername}
          userId={userData.id}
          onUsernameUpdate={handleUsernameUpdate}
        />
      </h1>
      <h1 className="text-slate-200 text-3xl mt-4">Your bookings</h1>
      <ShowBooking userId={userData.id} />
    </div>
  );
};

export default ShowUserInfo;
