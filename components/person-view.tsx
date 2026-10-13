import Link from "next/link";
import { AtSign } from "@/components/motion/at-sign";
import { DrawLine } from "@/components/motion/draw-line";
import { Fade } from "@/components/motion/fade";
import { IntroLock } from "@/components/motion/intro-lock";
import { Rise } from "@/components/motion/rise";
import { Wipe } from "@/components/motion/wipe";
import { PersonLinks } from "@/components/person-links";
import { Portrait } from "@/components/portrait";
import { SiteEnd } from "@/components/site-end";
import { firstName, headline, splitBio, type Alumnus } from "@/lib/alumni";

const COLUMN = "relative flex flex-col px-gutter pt-10 pb-8 md:pt-24 md:pb-6";

export function PersonView({
  person,
  previous,
  next,
}: {
  person: Alumnus;
  previous: Alumnus | null;
  next: Alumnus | null;
}) {
  const { lead, rest } = splitBio(person.bio);
  const { label, title, place } = headline(person);

  return (
    <div className="grid flex-1 grid-cols-1 md:h-[calc(100dvh-3.5rem)] md:grid-cols-[1fr_1.5fr_1fr]">
      <IntroLock />

      <section className={`${COLUMN} @container gap-10 md:justify-between`}>
        <div className="flex flex-col gap-6">
          <h1 className="text-[clamp(2.75rem,14cqw,5rem)] leading-[0.95] font-medium tracking-[-0.045em] whitespace-nowrap">
            <Rise>Hello,</Rise>
            <Rise step={1}>I&apos;m {firstName(person.name)}.</Rise>
          </h1>
          <Fade step={3}>
            <PersonLinks links={person.links} />
          </Fade>
        </div>

        {person.roles.length > 0 && (
          <Fade step={4}>
            <p className="mb-2 text-xs text-muted-foreground">At IEEE SRMIST</p>
            <ul className="flex flex-col">
              {person.roles.map((role) => (
                <li
                  key={`${role.title}-${role.from}`}
                  className="flex items-baseline justify-between gap-4 border-b py-1.5 text-[0.95rem] last:border-b-0"
                >
                  <span>{role.title}</span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {role.from === role.to
                      ? role.from
                      : `${role.from}–${String(role.to).slice(2)}`}
                  </span>
                </li>
              ))}
            </ul>
          </Fade>
        )}
      </section>

      <section
        className={`${COLUMN} gap-12 border-t md:justify-between md:border-t-0`}
      >
        <DrawLine index={0} />
        {person.bio ? (
          <p className="max-w-[34rem] text-[1.4rem] leading-[1.2] font-medium tracking-[-0.02em] lg:text-[1.75rem]">
            <Rise step={2}>
              {lead} <span className="text-muted-foreground">{rest}</span>
            </Rise>
          </p>
        ) : (
          <span />
        )}

        <Fade step={5} className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-[2rem] leading-[1] font-medium tracking-[-0.035em] lg:text-[2.75rem]">
            {title}
            {place && (
              <span className="block text-muted-foreground">
                {label === "Alumni" ? (
                  place
                ) : (
                  <>
                    <AtSign /> {place}
                  </>
                )}
              </span>
            )}
          </p>
        </Fade>
      </section>

      <section
        className={`${COLUMN} gap-10 border-t pb-[max(1.5rem,env(safe-area-inset-bottom))] md:justify-between md:border-t-0`}
      >
        <DrawLine index={1} />
        <div className="flex items-start justify-between gap-6">
          <Fade step={0}>
            <p className="flex items-center gap-1.5 text-sm tabular-nums">
              <span aria-hidden="true" className="text-[0.6em] text-primary">
                ◆
              </span>
              {person.year}
            </p>
          </Fade>
          <Wipe className="w-full max-w-56 xl:max-w-64">
            <Portrait name={person.name} photo={person.photo} />
          </Wipe>
        </div>

        <Fade step={6} className="flex flex-col gap-6">
          <nav
            aria-label="More alumni"
            className="grid grid-cols-2 gap-4 border-t pt-3 text-sm"
          >
            {previous ? (
              <Link
                href={`/${previous.slug}`}
                className="group flex flex-col gap-0.5"
              >
                <span className="text-xs text-muted-foreground">Previous</span>
                <span className="transition-colors group-hover:text-primary">
                  {previous.name}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/${next.slug}`}
                className="group flex flex-col items-end gap-0.5 text-right"
              >
                <span className="text-xs text-muted-foreground">Next</span>
                <span className="transition-colors group-hover:text-primary">
                  {next.name}
                </span>
              </Link>
            )}
          </nav>
          <SiteEnd />
        </Fade>
      </section>
    </div>
  );
}
