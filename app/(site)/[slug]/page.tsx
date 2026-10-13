import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonView } from "@/components/person-view";
import { loadPeople } from "@/lib/people";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const person = (await loadPeople()).find((entry) => entry.slug === slug);
  return person ? { title: person.name } : {};
}

export default async function PersonPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const people = await loadPeople();
  const index = people.findIndex((person) => person.slug === slug);
  const person = people[index];
  if (!person) notFound();
  return (
    <PersonView
      person={person}
      previous={people[index - 1] ?? null}
      next={people[index + 1] ?? null}
    />
  );
}
