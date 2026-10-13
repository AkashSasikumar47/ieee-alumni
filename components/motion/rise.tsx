"use client";

import { motion } from "motion/react";
import { EASE_OUT, INTRO } from "./timing";

export function Rise({
  children,
  step = 0,
  className = "",
}: {
  children: React.ReactNode;
  step?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{
          duration: INTRO.rise,
          ease: EASE_OUT,
          delay: INTRO.riseDelay + step * INTRO.riseStagger,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
