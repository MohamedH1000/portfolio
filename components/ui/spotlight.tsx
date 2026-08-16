"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      className={cn(
        // `overflow-visible` matters: an SVG root clips to its viewport by
        // default, which cuts the blurred falloff into a hard-edged rectangle.
        "pointer-events-none absolute z-[1] h-[169%] w-[138%] overflow-visible lg:w-[84%]",
        "-top-40 left-0 md:-top-20 md:left-60",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      initial={reduce ? { opacity: 1, x: "-50%", y: "-40%" } : { opacity: 0, scale: 0.5, x: "-72%", y: "-62%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-40%" }}
      transition={{ duration: reduce ? 0 : 2, ease: "easeOut", delay: reduce ? 0 : 0.75 }}
    >
      {/* Inset from the viewBox edges so the 300-unit blur has room to fade
          out inside the box rather than running straight off it. */}
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1893"
          cy="1421"
          rx="1350"
          ry="900"
          fill={fill}
          fillOpacity="0.24"
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
