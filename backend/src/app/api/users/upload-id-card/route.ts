import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import isIdCard from "@/lib/isIdCard";
import { getIdCardFolder } from "@/lib/uploadPath";
import fetch from "node-fetch";
import sharp from "sharp";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

const HF_MODEL = "qualcomm/MediaPipe-Face-Detection";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

interface HfDetectionBox {
  box: { x: number; y: number; width: number; height: number };
  score: number;
  // maybe other keys depending on model
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    let decoded;
    if (token) {
      decoded = verifyToken(token);
    }
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("idCard") as File | null;
    const userId = decoded?.userId;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const uploadDir = getIdCardFolder();
    const bytes = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, `${userId}-id-card.jpg`);
    fs.writeFileSync(filePath, bytes);

    const url = `/id-cards/${userId}-id-card.jpg`;

    // Check validity
    if (!(await isIdCard(filePath))) {
      return NextResponse.json({ message: "Not an ID card" }, { status: 406 });
    }

    // Update user record
    await prisma.user.update({
      where: { id: userId },
      data: {
        idCardPhotoUrl: url,
        idCardVerified: true,
      },
    });

    return NextResponse.json({ url }, { status: 200, statusText: "Uploaded" });
  } catch (err) {
    console.error("Upload & face extraction error:", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
