"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  return (
    <motion.svg
      className={cn(
        "pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%]",
        "-top-40 left-0 md:-top-20 md:left-60",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      initial={{ opacity: 0, scale: 0.5, x: "-72%", y: "-62%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-40%" }}
      transition={{ duration: 2, ease: "easeOut", delay: 0.75 }}
    >
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1924"
          cy="1421"
          rx="1924"
          ry="1421"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="spotlight-filter"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="300" />
        </filter>
      </defs>
    </motion.svg>
  );
}
