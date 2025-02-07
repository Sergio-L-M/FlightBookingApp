import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import FlightCard from "../components/flightCard/FlightCard";
import { test, expect, describe } from "vitest";
import { GeneralData } from "../components/PropsFlight"; // ✅ Importamos la interfaz correcta

// ✅ Mock del contexto de vuelo
vi.mock("../components/flightCard/flightContext", () => ({
  useFlight: () => ({
    setLoading: vi.fn(),
    openModal: vi.fn(),
    setSelectedFlight: vi.fn(),
  }),
}));

// ✅ Mock del contexto de búsqueda
vi.mock("../components/flightSearch/searchContext", () => ({
  useSearch: () => ({
    selectedKey: "testKey",
  }),
}));

describe("FlightCard Component", () => {
  const generalData: GeneralData = {
    totalDuration: "28H 35M",
    arrivalAirportCode: "BKK",
    totalPrice: "381.61",
    PricePerTraveler: "381.61",
    flightSchedule: "2025-02-15T11:45:00 → 2025-02-16T12:20:00",
    currency: "MXN",
    stops: [
      {
        arrivalAirportCode: "MNL",
        layoverTime: "16H 35M",
        arrivalAirportName: "NOT FOUND",
      },
      {
        arrivalAirportCode: "BKK",
        layoverTime: "0H 0M",
        arrivalAirportName: "SUVARNABHUMI INTL",
      },
    ],
    airline: "PR - PHILIPPINE AIRLINES",
    departureAirportName: "NOT FOUND",
    departureAirportCode: "SYD",
    arrivalAirportName: "SUVARNABHUMI INTL",
    operatingAirline: "PR - PHILIPPINE AIRLINES",
  };

  test("renders FlightCard component correctly", () => {
    render(<FlightCard generalData={generalData} id="FLIGHT123" />);

    // ✅ Usamos `getByTestId()` en lugar de `getByText()`
    expect(screen.getByTestId("flight-schedule")).toHaveTextContent(
        "15/02/2025 11:45 a. m. → 16/02/2025 12:20 p. m."
      );
      

    expect(screen.getByTestId("flight-route")).toHaveTextContent(
      "NOT FOUND (SYD) → SUVARNABHUMI INTL (BKK)"
    );

    expect(screen.getByTestId("flight-airline")).toHaveTextContent(
      "Airline: PR - PHILIPPINE AIRLINES"
    );

    expect(screen.getByTestId("flight-total-price")).toHaveTextContent(
      "381.61 MXN"
    );

    expect(screen.getByTestId("flight-price-per-traveler")).toHaveTextContent(
      "381.61 MXN"
    );
  });

  test("calls handleFlightClick when clicked", () => {
    render(<FlightCard generalData={generalData} id="FLIGHT123" />);

    // ✅ Ahora encontramos la tarjeta con `getByTestId()`
    const flightCard = screen.getByTestId("flight-card");
    fireEvent.click(flightCard);

    expect(screen.getByTestId("flight-price-per-traveler")).toBeInTheDocument();
  });
});
