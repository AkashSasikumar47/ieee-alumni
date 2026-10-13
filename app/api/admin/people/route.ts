import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/alumni";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PHOTO = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function link(value: unknown) {
  const url = text(value, 300);
  if (!url) return "";
  const full = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    return new URL(full).protocol.startsWith("http") ? full : null;
  } catch {
    return null;
  }
}

function year(value: unknown) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1990 && number <= 2100
    ? number
    : null;
}

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return fail("Unauthorized", 401);

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || typeof body !== "object") return fail("Invalid request");

  const id = text(body.id, 36);
  if (id && !UUID.test(id)) return fail("Invalid request");
  const name = text(body.name, 100);
  if (!name) return fail("Enter their name.");
  const slug = text(body.slug, 80);
  if (!SLUG.test(slug))
    return fail("Use only letters, numbers and dashes in the page address.");
  const passedOut = year(body.year);
  if (!passedOut) return fail("Enter the year they passed out.");
  const photo = text(body.photo, 200);
  if (photo && !PHOTO.test(photo)) return fail("Upload the photo again.");

  const links = (body.links ?? {}) as Record<string, unknown>;
  const linkedin = link(links.linkedin);
  const github = link(links.github);
  const instagram = link(links.instagram);
  const website = link(links.website);
  if ([linkedin, github, instagram, website].includes(null)) {
    return fail("Check the links: each must be a web address.");
  }

  const roles = [];
  for (const item of (Array.isArray(body.roles) ? body.roles : []).slice(
    0,
    12,
  )) {
    const role = (item ?? {}) as Record<string, unknown>;
    const title = text(role.title, 60);
    if (!title) continue;
    const from = year(role.from);
    const to = role.to === "" || role.to == null ? from : year(role.to);
    if (!from || !to || to < from) {
      return fail(`Check the years for "${title}".`);
    }
    roles.push({ title, from, to });
  }

  const row = {
    slug,
    name,
    year: passedOut,
    bio: text(body.bio, 400),
    now_role: text(body.nowRole, 80),
    now_company: text(body.nowCompany, 80),
    roles,
    linkedin: linkedin ?? "",
    github: github ?? "",
    instagram: instagram ?? "",
    website: website ?? "",
    photo,
    published: body.published === true,
  };

  const previous = id
    ? (
        await admin.supabase
          .from("ieee_alumni_people")
          .select("photo")
          .eq("id", id)
          .maybeSingle()
      ).data?.photo
    : "";

  const { data, error } = id
    ? await admin.supabase
        .from("ieee_alumni_people")
        .update(row)
        .eq("id", id)
        .select("id")
        .maybeSingle()
    : await admin.supabase
        .from("ieee_alumni_people")
        .insert(row)
        .select("id")
        .single();

  if (error) {
    return fail(
      error.code === "23505"
        ? "Another person already has that page address."
        : "Couldn't save. Try again.",
    );
  }
  if (!data) return fail("This person was deleted.", 404);
  if (previous && previous !== photo) {
    await admin.supabase.storage.from(PHOTO_BUCKET).remove([previous]);
  }
  return NextResponse.json({ id: data.id });
}
