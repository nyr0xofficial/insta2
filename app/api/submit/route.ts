import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, email, telephone, message } = body;

    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }

    const entry = {
      id: Date.now().toString(),
      nom,
      email,
      telephone: telephone || "",
      message,
      date: new Date().toISOString(),
    };

    await redis.lpush("formulaire:submissions", JSON.stringify(entry));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
