import { GetReviews } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const hotelId = await req.json();
    const response = await GetReviews(hotelId);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
  }
}
