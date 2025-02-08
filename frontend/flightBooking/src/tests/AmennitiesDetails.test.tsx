import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import AmenitiesDetails from "../components/flightDetails/amenitiesDetails";
import { Amenity } from "../components/PropsFlight"; // ✅ Importamos la interfaz correcta

describe("AmenitiesDetails Component", () => {
  const amenities: Amenity[] = [
    { description: "In-flight WiFi", isChargeable: true },
    { description: "Extra legroom", isChargeable: false },
    { description: "Premium meals", isChargeable: true },
  ];

  test("renders AmenitiesDetails component correctly", () => {
    render(<AmenitiesDetails type="Comfort" amenities={amenities} />);

    // ✅ Verificamos que el tipo de amenidad se muestra correctamente
    expect(screen.getByTestId("amenities-type")).toHaveTextContent("COMFORT");

    // ✅ Verificamos que la lista de amenidades está presente
    expect(screen.getByTestId("amenities-list")).toBeInTheDocument();

    // ✅ Verificamos cada amenidad individualmente
    expect(screen.getByTestId("amenity-desc-0")).toHaveTextContent("• In-flight WiFi");
    expect(screen.getByTestId("amenity-desc-1")).toHaveTextContent("• Extra legroom");
    expect(screen.getByTestId("amenity-desc-2")).toHaveTextContent("• Premium meals");

    // ✅ Verificamos si las amenidades son de pago o gratuitas
    expect(screen.getByTestId("amenity-charge-0")).toHaveTextContent("Chargeable");
    expect(screen.getByTestId("amenity-charge-1")).toHaveTextContent("Not chargeable");
    expect(screen.getByTestId("amenity-charge-2")).toHaveTextContent("Chargeable");
  });
});
