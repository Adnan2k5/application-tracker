import { prisma } from "@/app/lib/db/prisma";
import { ApplicationStatus } from "../../generated/prisma/enums";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type ApplicationData = {
  userId: string;
  company: string;
  role?: string;
  source?: string;
  status?: ApplicationStatus;
  appliedAt?: Date;
  notes?: string;
};

export async function POST(request: NextRequest) {
  try {
    const cookieStore = (await cookies()).get("sessionId");
    if (!cookieStore) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const requestData = (await request.json()) as ApplicationData;
    await prisma.application.create({
      data: {
        ...requestData,
        role: requestData.role ?? "",
        source: requestData.source ?? "",
        status: requestData.status ?? ApplicationStatus.APPLIED,
        appliedAt: requestData.appliedAt ?? new Date(),
        notes: requestData.notes ?? "",
      },
    });
    return new Response("Success", { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
