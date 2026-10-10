import { NextResponse } from "next/server";
import { applyRumorVote, readRumorVotes } from "@/lib/rumorVotes";

export async function GET() {
  return NextResponse.json(readRumorVotes());
}

type Body = {
  id?: string;
  vote?: "like" | "dislike" | "clear";
  prev?: "like" | "dislike" | null;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const id = body.id?.trim();
  const vote = body.vote;
  if (!id || !vote || !["like", "dislike", "clear"].includes(vote)) {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  const prev =
    body.prev === "like" || body.prev === "dislike" ? body.prev : null;
  const stats = applyRumorVote(id, vote, prev);
  return NextResponse.json({ id, ...stats });
}
