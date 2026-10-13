"use client";

import { motion } from "motion/react";
import { EASE_OUT, INTRO } from "./timing";

export function DrawLine({
  index = 0,
  className = "",
}: {
  index?: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{
        duration: INTRO.line,
        ease: EASE_OUT,
        delay: index * INTRO.lineStagger,
      }}
      className={`pointer-events-none absolute top-0 left-0 hidden h-full w-px origin-top bg-border md:block ${className}`}
    />
  );
}
