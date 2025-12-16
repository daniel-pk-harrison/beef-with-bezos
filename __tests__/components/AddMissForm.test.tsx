import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddMissForm } from "@/components/AddMissForm";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    form: ({
      children,
      className,
      onSubmit,
      ...props
    }: React.FormHTMLAttributes<HTMLFormElement>) => (
      <form className={className} onSubmit={onSubmit} {...props}>
        {children}
      </form>
    ),
  },
}));

// Mock the server action
const mockAddMissAction = vi.fn();
vi.mock("@/lib/actions", () => ({
  addMissAction: (...args: unknown[]) => mockAddMissAction(...args),
}));

describe("AddMissForm", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAdd.mockResolvedValue(undefined);
    mockAddMissAction.mockResolvedValue({ success: true, data: { id: "123" } });
  });

  it("renders form elements", () => {
    render(<AddMissForm onAdd={mockOnAdd} />);

    expect(screen.getByLabelText(/when did it happen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what happened/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to the count/i })
    ).toBeInTheDocument();
  });

  it("defaults date to today", () => {
    render(<AddMissForm onAdd={mockOnAdd} />);

    const dateInput = screen.getByLabelText(
      /when did it happen/i
    ) as HTMLInputElement;
    const today = new Date().toISOString().split("T")[0];
    expect(dateInput.value).toBe(today);
  });

  it("calls addMissAction with date and note on submit", async () => {
    const user = userEvent.setup();
    render(<AddMissForm onAdd={mockOnAdd} />);

    const dateInput = screen.getByLabelText(/when did it happen/i);
    const noteInput = screen.getByLabelText(/what happened/i);
    const submitButton = screen.getByRole("button", {
      name: /add to the count/i,
    });

    await user.clear(dateInput);
    await user.type(dateInput, "2024-01-15");
    await user.type(noteInput, "Package was lost");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddMissAction).toHaveBeenCalledWith(
        "2024-01-15",
        "Package was lost"
      );
    });
  });

  it("calls onAdd callback after successful submission", async () => {
    const user = userEvent.setup();
    render(<AddMissForm onAdd={mockOnAdd} />);

    const submitButton = screen.getByRole("button", {
      name: /add to the count/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  it("displays error message on failure", async () => {
    mockAddMissAction.mockResolvedValue({
      success: false,
      error: "Network error",
    });
    const user = userEvent.setup();

    render(<AddMissForm onAdd={mockOnAdd} />);

    const submitButton = screen.getByRole("button", {
      name: /add to the count/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    render(<AddMissForm onAdd={mockOnAdd} />);

    const noteInput = screen.getByLabelText(
      /what happened/i
    ) as HTMLInputElement;
    await user.type(noteInput, "Test note");
    await user.click(
      screen.getByRole("button", { name: /add to the count/i })
    );

    await waitFor(() => {
      expect(noteInput.value).toBe("");
    });
  });
});
