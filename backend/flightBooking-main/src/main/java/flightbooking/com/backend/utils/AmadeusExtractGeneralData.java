package flightbooking.com.backend.utils;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AmadeusExtractGeneralData {

    public Map<String, Object> get(JsonNode flight) {
        Map<String, Object> generalData = new HashMap<>();

        // ✅ Verificar existencia antes de acceder
        if (flight.has("validatingAirlineCodes") && flight.get("validatingAirlineCodes").size() > 0) {
            generalData.put("airline", flight.get("validatingAirlineCodes").get(0).asText());
        } else {
            generalData.put("airline", "Unknown");
        }

        if (!flight.has("itineraries") || flight.get("itineraries").size() == 0) {
            throw new IllegalArgumentException("Itineraries data is missing");
        }

        JsonNode itineraries = flight.get("itineraries").get(0);
        JsonNode segments = itineraries.get("segments");

        if (segments == null || segments.size() == 0) {
            throw new IllegalArgumentException("Segments data is missing");
        }

        JsonNode firstSegment = segments.get(0);
        JsonNode lastSegment = segments.get(segments.size() - 1);

        // ✅ Extraer aeropuertos de salida y llegada
        Map<String, String> departureAirport = new HashMap<>();
        departureAirport.put("code", firstSegment.path("departure").path("iataCode").asText("N/A"));
        departureAirport.put("time", firstSegment.path("departure").path("at").asText("Unknown"));

        Map<String, String> arrivalAirport = new HashMap<>();
        arrivalAirport.put("code", lastSegment.path("arrival").path("iataCode").asText("N/A"));
        arrivalAirport.put("time", lastSegment.path("arrival").path("at").asText("Unknown"));

        generalData.put("departureAirport", departureAirport);
        generalData.put("arrivalAirport", arrivalAirport);

        // ✅ Formatear horario de vuelo
        generalData.put("flightSchedule",
                departureAirport.get("time") + " → " + arrivalAirport.get("time"));

        // ✅ Extraer precio total y por viajero
        if (flight.has("price")) {
            JsonNode price = flight.get("price");
            String currency = price.path("currency").asText("USD");
            generalData.put("totalCost", price.path("total").asText("0.00") + " " + currency);

            if (flight.has("travelerPricings") && flight.get("travelerPricings").size() > 0) {
                JsonNode travelerPricing = flight.get("travelerPricings").get(0);
                generalData.put("costPerTraveler", travelerPricing.path("price").path("total").asText("0.00") + " " + currency);
            }
        }

        return generalData;
    }
}
