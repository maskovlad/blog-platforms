"use client";

import Image from "next/image";
import { useState } from "react";

import type { ComponentProps } from "react";
import type { WithClassName } from "@/types/common";

interface BlurImageProps extends WithClassName, ComponentProps<typeof Image> {
  alt: string;
}

export default function BlurImage(props: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      alt={props.alt}
      className={props.className}
      style={{
        transition: "700ms cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isLoading ? "scale(1.1)" : "scale(1)",
        filter: isLoading ? "grayscale(1) blur(40px)" : "grayscale(0) blur(0)",
      }}
      onLoadingComplete={() => setLoading(false)}
    />
  );
}
