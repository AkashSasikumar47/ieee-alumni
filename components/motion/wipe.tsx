"use client";

import { motion } from "motion/react";
import { EASE_OUT, INTRO } from "./timing";

export function Wipe({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      transition={{
        duration: INTRO.wipe,
        ease: EASE_OUT,
        delay: INTRO.wipeDelay,
      }}
    >
      {children}
    </motion.div>
  );
}
