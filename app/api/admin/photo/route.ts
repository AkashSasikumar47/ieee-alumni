import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/alumni";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Pick a photo." }, { status: 400 });
  }
  const extension = TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Use a JPG, PNG or WebP photo." },
      { status: 400 },
    );
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Keep the photo under 2 MB." },
      { status: 400 },
    );
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await admin.supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) {
    return NextResponse.json({ error: "Couldn't upload." }, { status: 400 });
  }
  return NextResponse.json({ path });
}
