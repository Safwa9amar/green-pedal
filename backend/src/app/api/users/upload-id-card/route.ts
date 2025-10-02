import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import generateProfileFromIdCard from "@/lib/generateProfileFromIdCard";
import { getIdCardFolder } from "@/lib/uploadPath";
import isIdCard from "@/lib/isIdCard";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("idCard") as File | null;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    const uploadDir = getIdCardFolder();
    // Save file locally
    const bytes = Buffer.from(await file.arrayBuffer());

    const filePath = `${uploadDir}/${userId}-id-card.jpg`;

    fs.writeFileSync(filePath, bytes);

    const url = `/id-cards/${userId}-id-card.jpg`;

    if (!(await isIdCard(filePath)))
      return NextResponse.json(
        {
          message: "it is not id card",
        },
        { status: 406 }
      );

    await prisma.user.update({
      where: { id: userId },
      data: {
        idCardPhotoUrl: url,
        idCardVerified: true,
      },
    });

    return NextResponse.json(
      { url },
      {
        status: 200,
        statusText: "identity card succesfuly uploaded",
      }
    );
  } catch (err) {
    console.error(err);
    NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
