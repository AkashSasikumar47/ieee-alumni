import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/alumni";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/admin/people/[id]">,
) {
  const admin = await getAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data, error } = await admin.supabase
    .from("ieee_alumni_people")
    .delete()
    .eq("id", id)
    .select("photo")
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "Couldn't delete." }, { status: 400 });
  }
  if (data.photo) {
    await admin.supabase.storage.from(PHOTO_BUCKET).remove([data.photo]);
  }
  return NextResponse.json({ ok: true });
}
