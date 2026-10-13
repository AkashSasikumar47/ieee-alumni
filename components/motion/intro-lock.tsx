"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { INTRO } from "./timing";

export function IntroLock() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      root.style.overflow = "";
    }, INTRO.lock * 1000);
    return () => {
      window.clearTimeout(timer);
      root.style.overflow = "";
    };
  }, [reduced]);

  return null;
}
