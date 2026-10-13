import { Globe } from "lucide-react";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/brand-icons";
import type { Links } from "@/lib/alumni";

const ITEMS: {
  key: keyof Links;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "github", label: "GitHub", Icon: GitHubIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "website", label: "Website", Icon: Globe },
];

export function PersonLinks({ links }: { links: Links }) {
  const present = ITEMS.filter(({ key }) => links[key]);
  if (!present.length) return null;
  return (
    <ul className="flex items-center gap-4">
      {present.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="block text-foreground transition-colors hover:text-primary"
          >
            <Icon className="size-[1.15rem]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
