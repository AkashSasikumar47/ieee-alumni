export type Role = { title: string; from: number; to: number };

export type Links = {
  linkedin: string;
  github: string;
  instagram: string;
  website: string;
};

export type Alumnus = {
  id: string;
  slug: string;
  name: string;
  year: number;
  bio: string;
  nowRole: string;
  nowCompany: string;
  roles: Role[];
  links: Links;
  photo: string;
  published: boolean;
};

export function firstName(name: string) {
  return name.split(" ")[0] ?? name;
}

export function headline(person: Alumnus) {
  if (person.nowRole || person.nowCompany) {
    return {
      label: "Now",
      title: person.nowRole || person.nowCompany,
      place: person.nowRole ? person.nowCompany : "",
    };
  }
  const top = person.roles.slice().sort((a, b) => b.to - a.to)[0];
  if (top) {
    return { label: "Then", title: top.title, place: "IEEE SRMIST" };
  }
  return { label: "Alumni", title: "IEEE SRMIST", place: `${person.year}` };
}

export function splitBio(bio: string) {
  const end = bio.search(/[.!?](\s|$)/);
  if (end === -1) return { lead: bio, rest: "" };
  return {
    lead: bio.slice(0, end + 1),
    rest: bio.slice(end + 1).trim(),
  };
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const PHOTO_BUCKET = "ieee-alumni-photos";

export function photoUrl(path: string) {
  if (!path) return "";
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}
