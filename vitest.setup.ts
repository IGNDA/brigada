import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createElement } from "react";

vi.mock("next/link", () => ({
  default({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return createElement("a", { href, ...props }, children);
  },
}));

vi.mock("next/image", () => ({
  default({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    return createElement("img", { src, alt, ...props });
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
