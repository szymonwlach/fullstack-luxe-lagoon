import { getHotel } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing hotel ID" }, { status: 400 });
  }

  const hotelId = Number(id);
  if (isNaN(hotelId)) {
    return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });
  }

  try {
    const hotel = await getHotel(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error during API request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
