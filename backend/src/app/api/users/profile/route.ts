import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { getProfilePhotoFolder } from "@/lib/uploadPath";
import fs, { existsSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
const prisma = new PrismaClient();

// Helper to add CORS headers (you can expand this as needed)
function withCORS(response: NextResponse) {
  // response.headers.set("Access-Control-Allow-Origin", "*");
  // response.headers.set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  // response.headers.set(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, Authorization"
  // );
  return response;
}

// ✅ GET user profile
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return withCORS(
        NextResponse.json(
          { message: "You must be logged in to view your profile." },
          { status: 401 }
        )
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return withCORS(
        NextResponse.json(
          { message: "Session expired or invalid. Please log in again." },
          { status: 401 }
        )
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        balance: true,
        idCardPhoto: true,
        photo: true,
        avatar: true,
        idCardPhotoUrl: true,
        idCardVerified: true,
        recharge: true,
      },
    });

    if (!user) {
      return withCORS(
        NextResponse.json(
          {
            message:
              "User not found. Please contact support if this is unexpected.",
          },
          { status: 404 }
        )
      );
    }

    return withCORS(NextResponse.json(user));
  } catch (error) {
    console.log(error);
    return withCORS(
      NextResponse.json(
        { message: "Oops! Something went wrong. Please try again later." },
        { status: 500 }
      )
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return withCORS(
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      );

    const decoded = verifyToken(token);
    if (!decoded)
      return withCORS(
        NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 401 }
        )
      );

    const formData = await req.formData();
    const userId = decoded.userId;
    const uploadDir = getProfilePhotoFolder();
    const { origin } = new URL(req.url);
    console.log(new URL(req.url));

    let photo = formData.get("photo") as File | null;

    if (photo) {
      const mimeType = photo.type;
      let extension = "";

      // ✅ Determine file extension
      switch (mimeType) {
        case "image/png":
          extension = "png";
          break;
        case "image/jpeg":
        case "image/jpg":
          extension = "jpg";
          break;
        default:
          return withCORS(
            NextResponse.json(
              { message: "Only PNG and JPG images are allowed." },
              { status: 400 }
            )
          );
      }

      const fileName = `${userId}-photo-profile.${extension}`;
      const filePath = path.join(uploadDir, fileName);

      // ✅ Remove old photo if exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.photo) {
        const oldFilePath = path.join(uploadDir, path.basename(user.photo));
        if (existsSync(oldFilePath)) unlinkSync(oldFilePath);
      }

      // ✅ Save new photo
      const bytes = Buffer.from(await photo.arrayBuffer());
      writeFileSync(filePath, bytes);

      const photoUrl = `/profile-photo/${fileName}`;

      let newUser = await prisma.user.update({
        where: { id: userId },
        data: { photo: photoUrl },
      });
      let fileData = {
        userId: newUser.id,
        extension,
        name: photo.name,
        path: filePath,
        description: "user profile photo",
        size: photo.size,
        mimeType: photo.type.replace("/", "_").toUpperCase() as any,
        url: `${origin}/${photoUrl}`,
      };
      await prisma.file.upsert({
        create: {
          ...fileData,
        },
        update: {
          ...fileData,
        },
        where: {
          userId: newUser.id,
        },
      });
    }

    // ✅ Update text fields (e.g. name, phone)
    const updatedData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "photo") updatedData[key] = value;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        balance: true,
        idCardPhoto: true,
        photo: true,
        avatar: true,
        idCardPhotoUrl: true,
        idCardVerified: true,
        recharge: true,
      },
    });

    return withCORS(
      NextResponse.json(
        { message: "Profile updated successfully!", user: updatedUser },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(error);
    return withCORS(
      NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      )
    );
  }
}

// Optional for preflight CORS
export async function OPTIONS() {
  return withCORS(NextResponse.json({}));
}
