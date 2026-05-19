import { requireAdmin } from "@/features/admin/services/admin-guard";
import { cloudinary, ALLOWED_ALL_TYPES, MAX_FILE_SIZE } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File must be under 25MB" }, { status: 400 });
    }

    if (!ALLOWED_ALL_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, MP4, and WebM files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `portfolio/${folder}`,
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) return reject(error ?? new Error("Upload failed"));
            resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
