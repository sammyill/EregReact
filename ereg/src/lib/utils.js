import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names while keeping the latest utility wins.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
