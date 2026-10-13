"use client";

import { motion } from "motion/react";
import { EASE_OUT, INTRO } from "./timing";

export function Fade({
  children,
  step = 0,
  className = "",
}: {
  children: React.ReactNode;
  step?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: INTRO.fade,
        ease: EASE_OUT,
        delay: INTRO.riseDelay + step * INTRO.riseStagger,
      }}
    >
      {children}
    </motion.div>
  );
}
