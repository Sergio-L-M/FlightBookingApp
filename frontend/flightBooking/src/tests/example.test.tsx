import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import "@testing-library/jest-dom";


test("renders a test component", () => {
  render(<div>Hello, Vitest!</div>);
  expect(screen.getByText("Hello, Vitest!")).toBeInTheDocument();
});
