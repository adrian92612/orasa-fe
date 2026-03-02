import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders with given text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles clicks", async () => {
    let clicked = false;
    render(<Button onClick={() => (clicked = true)}>Click me</Button>);

    await userEvent.click(screen.getByText("Click me"));
    expect(clicked).toBe(true);
  });
});
