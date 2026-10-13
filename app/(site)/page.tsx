import { AlumniIndex } from "@/components/alumni-index";
import { loadPeople } from "@/lib/people";

export default async function HomePage() {
  return <AlumniIndex people={await loadPeople()} />;
}
