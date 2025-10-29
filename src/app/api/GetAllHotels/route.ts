import { getAllHotels } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAllHotels();
    return NextResponse.json(data);
  } catch (error) {
    console.log("error during showing all hotels", error);
  }
}
