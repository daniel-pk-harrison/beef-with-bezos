import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import { SarcasticTagline } from "@/components/SarcasticTagline";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...props}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("SarcasticTagline", () => {
  it("renders tagline for count 0", () => {
    render(<SarcasticTagline count={0} />);
    // Should show one of the zero-count taglines
    const container = screen.getByRole("paragraph");
    expect(container).toBeInTheDocument();
  });

  it("renders tagline for count 1", () => {
    render(<SarcasticTagline count={1} />);
    const container = screen.getByRole("paragraph");
    expect(container).toBeInTheDocument();
  });

  it("renders tagline for medium counts (2-5)", () => {
    render(<SarcasticTagline count={3} />);
    const container = screen.getByRole("paragraph");
    expect(container.textContent).toContain("3");
  });

  it("renders tagline for high counts (6-10)", () => {
    render(<SarcasticTagline count={8} />);
    const container = screen.getByRole("paragraph");
    expect(container.textContent).toContain("8");
  });

  it("renders tagline for very high counts (10+)", () => {
    render(<SarcasticTagline count={15} />);
    const container = screen.getByRole("paragraph");
    expect(container.textContent).toContain("15");
  });
});
