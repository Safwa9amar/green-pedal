import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase"; // 👈 create this client
import { z } from "zod";

const prisma = new PrismaClient();

// ✅ Helper to add CORS headers (optional)
function withCORS(response: NextResponse) {
  return response;
}

// ✅ GET user profile
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return withCORS(
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      );
    }

    const decoded = verifyToken(token);
    if (!decoded)
      return withCORS(
        NextResponse.json({ message: "Invalid token" }, { status: 401 })
      );

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
        balanceTransactions: true,
      },
    });

    if (!user)
      return withCORS(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );

    return withCORS(NextResponse.json(user));
  } catch (error) {
    console.error(error);
    return withCORS(
      NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    );
  }
}

// ✅ PUT: update user + upload image to Supabase
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
        NextResponse.json({ message: "Invalid token" }, { status: 401 })
      );

    const formData = await req.formData();
    const userId = decoded.userId;
    let photo = formData.get("photo") as File | null;

    let photoUrl: string | undefined;

    if (photo) {
      // ✅ Determine file extension
      const mimeType = photo.type;
      let extension = "";
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

      const fileName = `${userId}-${Date.now()}.${extension}`;
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // ✅ Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("profile-photos") // 👈 your Supabase bucket name
        .upload(fileName, buffer, {
          contentType: photo.type,
          upsert: true,
        });
      console.log(data);

      if (error) {
        console.error("Supabase upload error:", error);
        return withCORS(
          NextResponse.json(
            { message: "Failed to upload image" },
            { status: 500 }
          )
        );
      }

      // ✅ Get public URL from Supabase
      const { data: publicUrlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      photoUrl = publicUrlData.publicUrl;
      console.log(photoUrl);

      // ✅ Update user photo field
      await prisma.user.update({
        where: { id: userId },
        data: { photo: photoUrl },
      });

      // ✅ Upsert file info
      await prisma.file.upsert({
        where: { userId },
        update: {
          name: photo.name,
          extension,
          description: "user profile photo",
          size: photo.size,
          mimeType: mimeType.replace("/", "_").toUpperCase() as any,
          url: photoUrl,
        },
        create: {
          userId,
          name: photo.name,
          extension,
          description: "user profile photo",
          size: photo.size,
          mimeType: mimeType.replace("/", "_").toUpperCase() as any,
          url: photoUrl,
        },
      });
    }

    // ✅ Update text fields (e.g., name, phone)
    const updatedData: Record<string, any> = {};
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
        photo: true,
        avatar: true,
        idCardPhotoUrl: true,
        idCardVerified: true,
      },
    });

    return withCORS(
      NextResponse.json({
        message: "Profile updated successfully!",
        user: updatedUser,
      })
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
