import { GetUserData } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // poprawne pobranie userId

    if (!userId) {
      return NextResponse.json({ error: "None of  userId" }, { status: 400 });
    }

    const currUser = await GetUserData(userId);

    if (!currUser) {
      return NextResponse.json({ error: "User not found " }, { status: 404 });
    }

    return NextResponse.json(currUser);
  } catch (error) {
    console.error("Błąd API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
