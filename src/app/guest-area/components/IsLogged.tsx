import { auth } from "@clerk/nextjs/server";
import Guest from "./Guest";
import LoggedIn from "./LoggedIn";

const IsLogged = async () => {
  const { userId } = await auth();
  console.log("userId:", userId);

  return <div>{userId ? <LoggedIn userId={userId} /> : <Guest />}</div>;
};

export default IsLogged;
