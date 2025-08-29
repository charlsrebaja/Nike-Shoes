// src/app/api/test-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const hasDatabaseUrl = !!databaseUrl;

  return NextResponse.json({
    DATABASE_URL: hasDatabaseUrl ? "SET" : "NOT SET",
    DATABASE_URL_LENGTH: databaseUrl?.length || 0,
    DATABASE_URL_START: databaseUrl?.substring(0, 20) + "..." || "N/A",
    allEnvVars: Object.keys(process.env).filter(
      (key) => key.includes("DATABASE") || key.includes("DB")
    ),
  });
}
