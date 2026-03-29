import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const raw = await redis.lrange("formulaire:submissions", 0, -1);

    const entries = raw.map((item) => {
      if (typeof item === "string") return JSON.parse(item);
      return item;
    });

    const header = "ID,Nom,Email,Téléphone,Message,Date\n";
    const rows = entries
      .map((e: Record<string, string>) =>
        [e.id, e.nom, e.email, e.telephone, `"${e.message.replace(/"/g, '""')}"`, e.date].join(",")
      )
      .join("\n");

    const csv = header + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="formulaire-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
