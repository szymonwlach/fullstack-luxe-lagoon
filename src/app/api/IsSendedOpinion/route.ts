import { isSendedOpinion } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const hotelId = data.hotelId;
    const userId = data.userId;
    const result = await isSendedOpinion(hotelId, userId);

    return NextResponse.json(result);
  } catch (error) {
    console.log("error: ", error);
  }
}
