import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import { Counter } from "@/components/Counter";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  useSpring: () => ({ set: vi.fn() }),
  useTransform: (_: unknown, fn: (v: number) => number) => fn(0),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Counter", () => {
  it("renders without crashing", () => {
    render(<Counter count={5} />);
    // Component should render without throwing
  });

  it("shows fire emoji when count >= 5", () => {
    const { container } = render(<Counter count={5} />);
    expect(container.textContent).toContain("🔥");
  });

  it("shows triple fire emoji when count >= 10", () => {
    const { container } = render(<Counter count={10} />);
    expect(container.textContent).toContain("🔥🔥🔥");
  });

  it("does not show fire emoji when count < 5", () => {
    const { container } = render(<Counter count={3} />);
    expect(container.textContent).not.toContain("🔥");
  });
});
