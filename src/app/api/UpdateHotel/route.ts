import { UpdateHotel } from "@/lib/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const hotelId = await req.json();
    await UpdateHotel(hotelId);
  } catch (error) {
    console.error(error);
  }
}
