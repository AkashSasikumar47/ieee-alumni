"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ieee/ui/components/alert-dialog";
import { Badge } from "@ieee/ui/components/badge";
import { Button } from "@ieee/ui/components/button";
import { Input } from "@ieee/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@ieee/ui/components/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ieee/ui/components/table";
import {
  PersonForm,
  toDraft,
  type Draft,
} from "@/components/admin/person-form";
import type { Alumnus } from "@/lib/alumni";

export function AdminBoard({ people }: { people: Alumnus[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Alumnus | null | undefined>(undefined);
  const [original, setOriginal] = useState<Draft>(toDraft(null));
  const [draft, setDraft] = useState<Draft>(toDraft(null));
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<"leave" | "delete" | null>(null);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter(
      (person) =>
        !needle ||
        [person.name, person.nowCompany, String(person.year)]
          .join(" ")
          .toLowerCase()
          .includes(needle),
    );
  }, [people, query]);

  const published = people.filter((person) => person.published).length;
  const isOpen = editing !== undefined;
  const creating = editing === null;
  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  const open = (person: Alumnus | null) => {
    const start = toDraft(person);
    setOriginal(start);
    setDraft(start);
    setEditing(person);
  };

  const close = () => {
    setEditing(undefined);
    setConfirm(null);
  };

  const requestClose = () => (dirty ? setConfirm("leave") : close());

  const save = async () => {
    setSaving(true);
    const response = await fetch("/api/admin/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, id: editing?.id ?? "" }),
    }).catch(() => null);
    setSaving(false);
    const result = (await response?.json().catch(() => null)) as {
      error?: string;
    } | null;
    if (!response?.ok) {
      toast.error(result?.error ?? "Couldn't save. Try again.");
      return;
    }
    toast.success(`${draft.name} saved`);
    close();
    router.refresh();
  };

  const remove = async () => {
    if (!editing) return;
    setSaving(true);
    const response = await fetch(`/api/admin/people/${editing.id}`, {
      method: "DELETE",
    }).catch(() => null);
    setSaving(false);
    if (!response?.ok) {
      toast.error("Couldn't delete. Try again.");
      return;
    }
    toast.success(`${editing.name} deleted`);
    close();
    router.refresh();
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-gutter pt-10 pb-12 md:pt-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[2.75rem] leading-[0.95] font-medium tracking-[-0.045em] md:text-[3.5rem]">
            Alumni
          </h1>
          <p className="text-sm text-muted-foreground">
            {people.length} people, {published} published
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, company, year"
              aria-label="Search alumni"
              className="pl-9 sm:w-72"
            />
          </div>
          <Button onClick={() => open(null)}>
            <Plus />
            Add person
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="hidden md:table-cell">Now</TableHead>
            <TableHead className="text-right">Page</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((person) => (
            <TableRow
              key={person.id}
              onClick={() => open(person)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{person.name}</TableCell>
              <TableCell className="tabular-nums">{person.year}</TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {[person.nowRole, person.nowCompany].filter(Boolean).join(", ")}
              </TableCell>
              <TableCell className="text-right">
                {person.published ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Link href={`/${person.slug}`} target="_blank">
                      Live
                      <ExternalLink />
                    </Link>
                  </Button>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
          {!shown.length && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-muted-foreground"
              >
                {people.length
                  ? "Nobody matches that search."
                  : "No alumni yet. Add the first one."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Sheet open={isOpen} onOpenChange={(value) => !value && requestClose()}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl">
          <div className="flex flex-col gap-1 px-6 pt-6 md:px-8">
            <SheetTitle className="text-2xl font-medium tracking-[-0.03em]">
              {creating ? "Add a person" : editing?.name}
            </SheetTitle>
            <SheetDescription>
              {creating
                ? "Fill in what they shared with you."
                : `/${editing?.slug ?? ""}`}
            </SheetDescription>
          </div>
          <PersonForm
            draft={draft}
            onChange={setDraft}
            creating={creating}
            dirty={dirty}
            saving={saving}
            onDiscard={() => (creating ? close() : setDraft(original))}
            onDelete={creating ? null : () => setConfirm("delete")}
            onSave={save}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={confirm !== null}
        onOpenChange={(value) => !value && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "delete"
                ? `Delete ${editing?.name ?? "this person"}?`
                : "Discard your changes?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "delete"
                ? "Their page and photo are removed for good."
                : "What you changed in this panel won't be saved."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {confirm === "delete" ? "Keep" : "Keep editing"}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirm === "delete" ? remove : close}
            >
              {confirm === "delete" ? "Delete" : "Discard"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
