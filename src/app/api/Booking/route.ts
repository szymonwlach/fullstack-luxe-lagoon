import { createBooking } from "@/lib/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const booking = {
      ...data,
      // Convert string dates to Date objects if needed
      checkInDate: new Date(data.checkInDate),
      checkOutDate: new Date(data.checkOutDate),
    };
    await createBooking(booking);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Booking API Error:", error);
    // Return a more specific error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
