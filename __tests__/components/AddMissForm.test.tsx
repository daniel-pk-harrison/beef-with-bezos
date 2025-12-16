import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddMissForm } from "@/components/AddMissForm";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    form: ({ children, className, onSubmit, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
      <form className={className} onSubmit={onSubmit} {...props}>{children}</form>
    ),
  },
}));

describe("AddMissForm", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAdd.mockResolvedValue(undefined);
  });

  it("renders form elements", () => {
    render(<AddMissForm onAdd={mockOnAdd} />);

    expect(screen.getByLabelText(/when did it happen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what happened/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to the count/i })).toBeInTheDocument();
  });

  it("defaults date to today", () => {
    render(<AddMissForm onAdd={mockOnAdd} />);

    const dateInput = screen.getByLabelText(/when did it happen/i) as HTMLInputElement;
    const today = new Date().toISOString().split("T")[0];
    expect(dateInput.value).toBe(today);
  });

  it("calls onAdd with date and note on submit", async () => {
    const user = userEvent.setup();
    render(<AddMissForm onAdd={mockOnAdd} />);

    const dateInput = screen.getByLabelText(/when did it happen/i);
    const noteInput = screen.getByLabelText(/what happened/i);
    const submitButton = screen.getByRole("button", { name: /add to the count/i });

    await user.clear(dateInput);
    await user.type(dateInput, "2024-01-15");
    await user.type(noteInput, "Package was lost");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith("2024-01-15", "Package was lost");
    });
  });

  it("shows loading state during submission", async () => {
    mockOnAdd.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    const user = userEvent.setup();

    render(<AddMissForm onAdd={mockOnAdd} />);

    const submitButton = screen.getByRole("button", { name: /add to the count/i });
    await user.click(submitButton);

    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("displays error message on failure", async () => {
    mockOnAdd.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();

    render(<AddMissForm onAdd={mockOnAdd} />);

    const submitButton = screen.getByRole("button", { name: /add to the count/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    render(<AddMissForm onAdd={mockOnAdd} />);

    const noteInput = screen.getByLabelText(/what happened/i) as HTMLInputElement;
    await user.type(noteInput, "Test note");
    await user.click(screen.getByRole("button", { name: /add to the count/i }));

    await waitFor(() => {
      expect(noteInput.value).toBe("");
    });
  });
});
