import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import { MissCard } from "@/components/MissCard";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
  },
}));

const mockMiss = {
  id: "abc123defg",
  date: "2024-01-15",
  note: "Package left in rain",
  createdAt: 1705276800000,
};

describe("MissCard", () => {
  it("renders date correctly", () => {
    render(<MissCard miss={mockMiss} index={0} />);
    // Should format date in a readable format (exact date may vary by timezone)
    expect(screen.getByText(/Jan \d+, 2024/)).toBeInTheDocument();
  });

  it("renders note when provided", () => {
    render(<MissCard miss={mockMiss} index={0} />);
    expect(screen.getByText("Package left in rain")).toBeInTheDocument();
  });

  it("shows placeholder when note is empty", () => {
    const missWithoutNote = { ...mockMiss, note: "" };
    render(<MissCard miss={missWithoutNote} index={0} />);
    expect(screen.getByText("No details provided")).toBeInTheDocument();
  });

  it("renders index as 1-based number", () => {
    render(<MissCard miss={mockMiss} index={4} />);
    expect(screen.getByText("#5")).toBeInTheDocument();
  });

  it("shows delete button when showDelete is true", () => {
    const onDelete = vi.fn();
    render(<MissCard miss={mockMiss} index={0} onDelete={onDelete} showDelete={true} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("hides delete button when showDelete is false", () => {
    const onDelete = vi.fn();
    render(<MissCard miss={mockMiss} index={0} onDelete={onDelete} showDelete={false} />);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("calls onDelete with id when delete button clicked", () => {
    const onDelete = vi.fn();
    render(<MissCard miss={mockMiss} index={0} onDelete={onDelete} showDelete={true} />);

    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledWith("abc123defg");
  });
});
