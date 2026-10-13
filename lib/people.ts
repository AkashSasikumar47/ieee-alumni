import { createClient } from "@ieee/supabase/server";
import type { Database } from "@ieee/supabase/types";
import type { Alumnus, Role } from "@/lib/alumni";

type Row = Database["public"]["Tables"]["ieee_alumni_people"]["Row"];

const COLUMNS =
  "id, slug, name, year, bio, now_role, now_company, roles, linkedin, github, instagram, website, photo, published";

function toRoles(value: Row["roles"]): Role[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const { title, from, to } = item as Record<string, unknown>;
    if (typeof title !== "string" || typeof from !== "number") return [];
    return [{ title, from, to: typeof to === "number" ? to : from }];
  });
}

function toAlumnus(row: Pick<Row, keyof Row>): Alumnus {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    year: row.year,
    bio: row.bio,
    nowRole: row.now_role,
    nowCompany: row.now_company,
    roles: toRoles(row.roles),
    links: {
      linkedin: row.linkedin,
      github: row.github,
      instagram: row.instagram,
      website: row.website,
    },
    photo: row.photo,
    published: row.published,
  };
}

export async function loadPeople({ drafts = false } = {}) {
  const supabase = await createClient();
  let query = supabase.from("ieee_alumni_people").select(COLUMNS).order("name");
  if (!drafts) query = query.eq("published", true);
  const { data } = await query;
  return (data ?? []).map((row) => toAlumnus(row as Row));
}
