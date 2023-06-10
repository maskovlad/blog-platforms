"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";

export default function Nav({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.pageYOffset > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  
  return (
    <div
      style={{
        display: "flex",
        top: "0",
        right: "0",
        left: "0",
        zIndex: "30",
        backgroundColor: "#ffffff",
        transitionProperty: "all",
        transitionDuration: "150ms",
        height: "4rem",
        position: "fixed",
        width: "100%",
        filter: scrolled ? "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06))" : "none",
      }}
    >
      {children}
    </div>
  );
}
