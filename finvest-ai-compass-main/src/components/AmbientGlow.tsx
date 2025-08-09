import { useEffect } from "react";

/**
 * AmbientGlow sets CSS variables used by the background gradient to subtly follow the pointer.
 * Respects prefers-reduced-motion.
 */
const AmbientGlow = () => {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const onMove = (e: PointerEvent) => {
      const root = document.documentElement;
      root.style.setProperty("--mouse-x", `${e.clientX}px`);
      root.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
};

export default AmbientGlow;
