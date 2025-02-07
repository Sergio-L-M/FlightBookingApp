import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PriceDetails } from "../components/flightDetails/PriceDetails";
import { test, expect, describe } from "vitest";

// ✅ Mock de `useFlight`, manteniendo `FlightProvider`
vi.mock("../components/flightCard/flightContext", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("../components/flightCard/flightContext"); // ✅ Castea `actual`

  return {
    ...actual, // ✅ Mantiene `FlightProvider`
    useFlight: () => ({
      selectedFlight: {
        pricing: {
          total: "1000",
          fees: [{ type: "Tax", amount: "50" }],
          travelerPrices: [
            {
              travelerId: "1",
              travelerType: "Adult",
              fareOption: "Economy",
              price: { base: "800", total: "1000", currency: "USD" },
            },
          ],
          grandTotal: "1050",
          base: "800",
          currency: "USD",
        },
      },
    }),
  };
});

// ✅ Importamos `FlightProvider` después del mock
import { FlightProvider } from "../components/flightCard/flightContext";

describe("PriceDetails Component", () => {
  test("renders PriceDetails component correctly", () => {
    render(
      <FlightProvider> {/* ✅ Ahora `FlightProvider` está disponible */}
        <PriceDetails />
      </FlightProvider>
    );

    // ✅ Verificamos que los textos de los precios principales estén presentes
    expect(screen.getByTestId("price-title")).toHaveTextContent("Price Details");
    expect(screen.getByTestId("price-total")).toHaveTextContent("Total: 1,000.00 USD");
    expect(screen.getByTestId("price-base")).toHaveTextContent("Base: 800.00 USD");
    expect(screen.getByTestId("price-grand-total")).toHaveTextContent("Grand Total: 1,050.00 USD");

    // ✅ Verificamos que las tarifas estén presentes
    expect(screen.getByTestId("fees-title")).toHaveTextContent("Fees:");
    expect(screen.getByTestId("fee-item-0")).toHaveTextContent("Tax: 50.00 USD");

    // ✅ Verificamos que los precios por viajero estén presentes
    expect(screen.getByTestId("traveler-prices-title")).toHaveTextContent("Traveler Prices:");
    expect(screen.getByTestId("traveler-id-0")).toHaveTextContent("ID: 1 — Adult");
    expect(screen.getByTestId("traveler-fare-option-0")).toHaveTextContent("Fare Option: Economy");
    expect(screen.getByTestId("traveler-base-price-0")).toHaveTextContent("Base: 800.00 USD");
    expect(screen.getByTestId("traveler-total-price-0")).toHaveTextContent("Total: 1,000.00 USD");
  });
});
