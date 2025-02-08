import { render, screen, fireEvent } from "@testing-library/react";
import ItineraryCard from "../components/flightDetails/itineraryCard";
import { test, expect, describe } from "vitest";

const mockItinerary = {
    segmentId: "SEG123", // ✅ Campo agregado
    departureTime: "2025-02-15T11:45:00",
    arrivalTime: "2025-02-16T12:20:00",
    departureAirportName: "Sydney Airport",
    departureAirportCode: "SYD",
    arrivalAirportName: "Bangkok Airport",
    arrivalAirportCode: "BKK",
    flightNumber: "PR123",
    airline: "Philippine Airlines",
    class: "Economy",
    operatingAirline: "Philippine Airlines",
    duration: "10h 30m",
    cabin: "Business",
    layoverTime: "2h 15m",
    aircraft: "Boeing 777", // ✅ Campo agregado
    fareBasis: "Y123", // ✅ Campo agregado
    amenities: {
      "In-Flight Entertainment": [
        { description: "Movies", isChargeable: false },
        { description: "Music", isChargeable: false },
      ],
    },
  };
  

describe("ItineraryCard Component", () => {
  test("renders ItineraryCard component correctly", () => {
    render(<ItineraryCard itinerary={mockItinerary} />);

    // ✅ Verificamos que los elementos clave están presentes
    expect(screen.getByTestId("itinerary-card")).toBeInTheDocument();
    expect(screen.getByTestId("departure-time")).toHaveTextContent("15/02/2025 11:45 a. m.");
    expect(screen.getByTestId("departure-airport")).toHaveTextContent("Sydney Airport (SYD)");
    expect(screen.getByTestId("arrival-time")).toHaveTextContent("16/02/2025 12:20 p. m.");
    expect(screen.getByTestId("arrival-airport")).toHaveTextContent("Bangkok Airport (BKK)");
    expect(screen.getByTestId("flight-number")).toHaveTextContent("PR123");
    expect(screen.getByTestId("airline")).toHaveTextContent("Philippine Airlines");
    expect(screen.getByTestId("class")).toHaveTextContent("Economy");
    expect(screen.getByTestId("operating-airline")).toHaveTextContent("Philippine Airlines");
    expect(screen.getByTestId("duration")).toHaveTextContent("10h 30m");
    expect(screen.getByTestId("cabin")).toHaveTextContent("Business");
    expect(screen.getByTestId("layover-time")).toHaveTextContent("2h 15m");
  });

  test("expands amenities accordion when clicked", () => {
    render(<ItineraryCard itinerary={mockItinerary} />);
    
    const accordion = screen.getByTestId("amenities-accordion");
    fireEvent.click(accordion);

    expect(screen.getByTestId("amenities-details")).toBeInTheDocument();

  });
});
