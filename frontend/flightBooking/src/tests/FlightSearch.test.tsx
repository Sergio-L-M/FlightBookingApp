import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import FlightSearch from "../components/flightSearch/flightSearch";
import { test, expect, describe } from "vitest";

// ✅ Mock de `useSearch` para evitar errores de contexto
vi.mock("../components/flightSearch/searchContext", () => ({
  useSearch: () => ({
    setOrigin: vi.fn(),
    setDestination: vi.fn(),
    setCurrency: vi.fn(),
    setAdults: vi.fn(),
    setOneWay: vi.fn(),
    oneWay: false,
    currency: "USD",
    adults: 1,
    loading: false,
    setArrivalDate: vi.fn(),
    arrivalDate: null,
    setDepartureDate: vi.fn(),
    departureDate: null,
  }),
}));

describe("FlightSearch Component", () => {
  const mockHandleSearch = vi.fn();

  test("renders FlightSearch component correctly", () => {
    render(<FlightSearch handleSearch={mockHandleSearch} />);

    // ✅ Verificamos que los elementos clave están presentes
    expect(screen.getByTestId("flight-search-container")).toBeInTheDocument();
    expect(screen.getByTestId("flight-search-form")).toBeInTheDocument();
    expect(screen.getByTestId("one-way-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("currency-selector")).toBeInTheDocument();
    expect(screen.getByTestId("adults-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
  });

  test("calls handleSearch when search button is clicked", () => {
    render(<FlightSearch handleSearch={mockHandleSearch} />);

    const searchButton = screen.getByTestId("search-button");
    fireEvent.click(searchButton);

    expect(mockHandleSearch).toHaveBeenCalled();
  });
});
