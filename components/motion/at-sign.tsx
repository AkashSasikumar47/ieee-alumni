"use client";

import { motion, useReducedMotion } from "motion/react";
import { AT } from "./timing";

export function AtSign({ delay = AT.delay }: { delay?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      aria-label="at"
      className="inline-block bg-[linear-gradient(110deg,var(--primary)_35%,color-mix(in_oklch,var(--primary),var(--background)_60%)_50%,var(--primary)_65%)] bg-[length:300%_100%] bg-clip-text pr-[0.06em] text-transparent"
      initial={
        reduced
          ? false
          : {
              rotate: AT.spin,
              scale: AT.from,
              opacity: 0,
              filter: "blur(12px)",
              backgroundPosition: "100% 0%",
            }
      }
      animate={{
        rotate: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        backgroundPosition: ["100% 0%", "0% 0%"],
      }}
      transition={{
        rotate: { type: "spring", stiffness: 70, damping: 9, delay },
        scale: { type: "spring", stiffness: 120, damping: 10, delay },
        opacity: { duration: 0.3, delay },
        filter: { duration: 0.6, delay },
        backgroundPosition: {
          duration: AT.shine,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: AT.shineEvery,
          delay: delay + 0.6,
        },
      }}
      whileHover={{
        rotate: 360,
        scale: 1.25,
        transition: { type: "spring", stiffness: 160, damping: 10 },
      }}
    >
      @
    </motion.span>
  );
}
