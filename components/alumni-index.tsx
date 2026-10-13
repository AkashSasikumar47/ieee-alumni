"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { AtSign } from "@/components/motion/at-sign";
import { DrawLine } from "@/components/motion/draw-line";
import { Fade } from "@/components/motion/fade";
import { IntroLock } from "@/components/motion/intro-lock";
import { Rise } from "@/components/motion/rise";
import { EASE_OUT, PORTRAIT } from "@/components/motion/timing";
import { Wipe } from "@/components/motion/wipe";
import { Portrait } from "@/components/portrait";
import { SiteEnd } from "@/components/site-end";
import { headline, type Alumnus } from "@/lib/alumni";

const COLUMN = "relative flex flex-col px-gutter pt-10 pb-8 md:pt-24 md:pb-6";

function Summary({ person }: { person: Alumnus }) {
  const { label, title, place } = headline(person);
  if (label === "Alumni") return null;
  return (
    <p className="text-muted-foreground">
      {title}
      {place && (
        <>
          {" "}
          <AtSign delay={0.05} /> {place}
        </>
      )}
    </p>
  );
}

export function AlumniIndex({ people }: { people: Alumnus[] }) {
  const [active, setActive] = useState("");
  const current = people.find((person) => person.slug === active) ?? null;

  return (
    <div className="grid flex-1 grid-cols-1 md:h-[calc(100dvh-3.5rem)] md:grid-cols-[1fr_1.5fr_1fr]">
      <IntroLock />

      <section className={`${COLUMN} @container gap-10 md:justify-between`}>
        <div className="flex flex-col gap-5">
          <h1 className="text-[clamp(2.75rem,14cqw,5rem)] leading-[0.95] font-medium tracking-[-0.045em] whitespace-nowrap">
            <Rise>The people</Rise>
            <Rise step={1}>who came</Rise>
            <Rise step={2}>before.</Rise>
          </h1>
          <Fade step={3}>
            <p className="max-w-xs text-sm text-muted-foreground">
              {people.length} alumni of IEEE SRMIST, and what they went on to
              do.
            </p>
          </Fade>
        </div>
      </section>

      <section className="relative border-t md:min-h-0 md:border-t-0">
        <DrawLine index={0} />
        <Fade
          step={3}
          className="h-full overflow-y-auto overscroll-contain px-gutter pt-6 pb-8 md:pt-24 md:pb-6"
        >
          <ul
            className="flex flex-col border-t"
            onMouseLeave={() => setActive("")}
            onBlur={() => setActive("")}
          >
            {people.map((person) => (
              <li key={person.slug} className="border-b">
                <Link
                  href={`/${person.slug}`}
                  onMouseEnter={() => setActive(person.slug)}
                  onFocus={() => setActive(person.slug)}
                  className="group flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="text-xl font-medium tracking-[-0.02em] transition-colors group-hover:text-primary lg:text-2xl">
                    {person.name}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {person.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Fade>
      </section>

      <section className={`${COLUMN} hidden md:flex md:justify-between`}>
        <DrawLine index={1} />
        <div className="flex flex-col items-end gap-4">
          <Wipe className="w-full max-w-56 xl:max-w-64">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current?.slug ?? "cover"}
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: PORTRAIT.swap, ease: EASE_OUT }}
              >
                {current ? (
                  <Portrait name={current.name} photo={current.photo} />
                ) : (
                  <div className="relative aspect-[4/5] bg-muted">
                    <Image
                      src="/photos/ieee-srmist-team.webp"
                      alt="The IEEE SRMIST team"
                      fill
                      preload
                      sizes="16rem"
                      className="object-cover"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Wipe>
          <Fade
            step={5}
            className="flex flex-col items-end gap-1 text-right text-sm"
          >
            {current ? (
              <>
                <p>{current.name}</p>
                <Summary person={current} />
              </>
            ) : (
              <>
                <p>IEEE SRMIST</p>
                <p className="text-muted-foreground">
                  Hover a name to meet them
                </p>
              </>
            )}
          </Fade>
        </div>
        <Fade step={6}>
          <SiteEnd />
        </Fade>
      </section>

      <div className="px-gutter pb-[max(1.5rem,env(safe-area-inset-bottom))] md:hidden">
        <SiteEnd />
      </div>
    </div>
  );
}
