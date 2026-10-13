"use client";

import { useRef, useState } from "react";
import { ImageUp, Plus, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@ieee/ui/components/button";
import { Checkbox } from "@ieee/ui/components/checkbox";
import { Input } from "@ieee/ui/components/input";
import { Label } from "@ieee/ui/components/label";
import { Textarea } from "@ieee/ui/components/textarea";
import { Portrait } from "@/components/portrait";
import { slugify, type Alumnus, type Links } from "@/lib/alumni";

export type Draft = Omit<Alumnus, "id" | "year" | "roles"> & {
  year: string;
  roles: { title: string; from: string; to: string }[];
};

const THIS_YEAR = new Date().getFullYear();

export function toDraft(person: Alumnus | null): Draft {
  return {
    slug: person?.slug ?? "",
    name: person?.name ?? "",
    year: person ? String(person.year) : String(THIS_YEAR),
    bio: person?.bio ?? "",
    nowRole: person?.nowRole ?? "",
    nowCompany: person?.nowCompany ?? "",
    roles: person?.roles.length
      ? person.roles.map((role) => ({
          title: role.title,
          from: String(role.from),
          to: String(role.to),
        }))
      : [{ title: "", from: "", to: "" }],
    links: {
      linkedin: person?.links.linkedin ?? "",
      github: person?.links.github ?? "",
      instagram: person?.links.instagram ?? "",
      website: person?.links.website ?? "",
    },
    photo: person?.photo ?? "",
    published: person?.published ?? false,
  };
}

const LINK_FIELDS: { key: keyof Links; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Website" },
];

function Field({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={id} className="text-xs font-normal text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t pt-5">
      <h3 className="flex items-center gap-1.5 text-sm font-medium">
        <span aria-hidden="true" className="text-[0.6em] text-primary">
          ◆
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PersonForm({
  draft,
  onChange,
  creating,
  dirty,
  saving,
  onDiscard,
  onDelete,
  onSave,
}: {
  draft: Draft;
  onChange: (draft: Draft) => void;
  creating: boolean;
  dirty: boolean;
  saving: boolean;
  onDiscard: () => void;
  onDelete: (() => void) | null;
  onSave: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const body = new FormData();
    body.set("photo", file);
    const response = await fetch("/api/admin/photo", {
      method: "POST",
      body,
    }).catch(() => null);
    const result = (await response?.json().catch(() => null)) as {
      path?: string;
      error?: string;
    } | null;
    setUploading(false);
    if (!response?.ok || !result?.path) {
      toast.error(result?.error ?? "Couldn't upload. Try again.");
      return;
    }
    onChange({ ...draft, photo: result.path });
  };

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    onChange({ ...draft, [key]: value });

  const setRole = (
    index: number,
    key: "title" | "from" | "to",
    value: string,
  ) =>
    set(
      "roles",
      draft.roles.map((role, at) =>
        at === index ? { ...role, [key]: value } : role,
      ),
    );

  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <div className="flex flex-col gap-6 px-6 py-6 md:px-8">
        <section className="flex flex-col gap-4">
          <Field id="person-name" label="Full name">
            <Input
              id="person-name"
              value={draft.name}
              onChange={(event) => {
                const name = event.target.value;
                onChange({
                  ...draft,
                  name,
                  slug: creating ? slugify(name) : draft.slug,
                });
              }}
              maxLength={100}
              required
              autoFocus={creating}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
            <Field id="person-year" label="Passed out in">
              <Input
                id="person-year"
                value={draft.year}
                onChange={(event) => set("year", event.target.value)}
                inputMode="numeric"
                pattern="(19|20)[0-9]{2}"
                maxLength={4}
                required
              />
            </Field>
            <Field id="person-slug" label="Page address">
              <Input
                id="person-slug"
                value={draft.slug}
                onChange={(event) => set("slug", slugify(event.target.value))}
                maxLength={80}
                required
              />
            </Field>
          </div>
        </section>

        <Group title="Their story">
          <Field
            id="person-bio"
            label="Bio (optional, the first sentence shows dark)"
          >
            <Textarea
              id="person-bio"
              value={draft.bio}
              onChange={(event) => set("bio", event.target.value)}
              maxLength={400}
              rows={4}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="person-now-role" label="Now: role (optional)">
              <Input
                id="person-now-role"
                value={draft.nowRole}
                onChange={(event) => set("nowRole", event.target.value)}
                maxLength={80}
              />
            </Field>
            <Field
              id="person-now-company"
              label="Now: company or university (optional)"
            >
              <Input
                id="person-now-company"
                value={draft.nowCompany}
                onChange={(event) => set("nowCompany", event.target.value)}
                maxLength={80}
              />
            </Field>
          </div>
        </Group>

        <Group title="Roles at IEEE SRMIST">
          {draft.roles.map((role, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_4.5rem_4.5rem_auto] items-end gap-2"
            >
              <Field id={`role-title-${index}`} label="Role">
                <Input
                  id={`role-title-${index}`}
                  value={role.title}
                  onChange={(event) =>
                    setRole(index, "title", event.target.value)
                  }
                  maxLength={60}
                />
              </Field>
              <Field id={`role-from-${index}`} label="From">
                <Input
                  id={`role-from-${index}`}
                  value={role.from}
                  onChange={(event) =>
                    setRole(index, "from", event.target.value)
                  }
                  inputMode="numeric"
                  maxLength={4}
                />
              </Field>
              <Field id={`role-to-${index}`} label="To">
                <Input
                  id={`role-to-${index}`}
                  value={role.to}
                  onChange={(event) => setRole(index, "to", event.target.value)}
                  inputMode="numeric"
                  maxLength={4}
                />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove role"
                disabled={draft.roles.length === 1}
                onClick={() =>
                  set(
                    "roles",
                    draft.roles.filter((_, at) => at !== index),
                  )
                }
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() =>
              set("roles", [...draft.roles, { title: "", from: "", to: "" }])
            }
          >
            <Plus />
            Add a role
          </Button>
        </Group>

        <Group title="Links (all optional)">
          <div className="grid gap-4 sm:grid-cols-2">
            {LINK_FIELDS.map(({ key, label }) => (
              <Field key={key} id={`link-${key}`} label={label}>
                <Input
                  id={`link-${key}`}
                  value={draft.links[key]}
                  onChange={(event) =>
                    set("links", { ...draft.links, [key]: event.target.value })
                  }
                  maxLength={300}
                  inputMode="url"
                />
              </Field>
            ))}
          </div>
        </Group>

        <Group title="Photo">
          <div className="flex items-end gap-4">
            <Portrait
              name={draft.name || "this person"}
              photo={draft.photo}
              className="w-28"
            />
            <div className="flex flex-col gap-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void upload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
              >
                <ImageUp />
                {uploading
                  ? "Uploading…"
                  : draft.photo
                    ? "Replace photo"
                    : "Upload photo"}
              </Button>
              {draft.photo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => set("photo", "")}
                >
                  Remove photo
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP, under 2 MB, portrait works best.
              </p>
            </div>
          </div>
        </Group>

        <label className="flex items-start gap-3 border-t pt-5 text-sm">
          <Checkbox
            checked={draft.published}
            onCheckedChange={(value) => set("published", value === true)}
            className="mt-0.5"
          />
          <span className="flex flex-col gap-0.5">
            <span className="font-medium">Published</span>
            <span className="text-muted-foreground">
              Only turn this on once they have agreed to their page.
            </span>
          </span>
        </label>
      </div>

      <div className="sticky bottom-0 mt-auto flex items-center gap-2 border-t bg-background px-6 py-4 md:px-8">
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Delete person"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash />
          </Button>
        )}
        <span className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          onClick={onDiscard}
          disabled={(!dirty && !creating) || saving}
        >
          Discard
        </Button>
        <Button type="submit" disabled={!dirty || saving || uploading}>
          {saving ? "Saving…" : creating ? "Add person" : "Save"}
        </Button>
      </div>
    </form>
  );
}
