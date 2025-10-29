import { UpdateUser } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newUser = await UpdateUser(data);
    return NextResponse.json({
      success: "Profile updated successfully!",
      updatedUser: newUser,
    });
  } catch (error) {
    console.log("error: ", error);
  }
}
