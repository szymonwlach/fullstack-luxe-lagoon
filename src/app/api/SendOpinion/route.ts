import { AddOpinion } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await AddOpinion(data);

    // Zwracamy odpowiedź o sukcesie
    return NextResponse.json(
      { message: "Opinion added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    // Zwracamy odpowiedź o błędzie
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
