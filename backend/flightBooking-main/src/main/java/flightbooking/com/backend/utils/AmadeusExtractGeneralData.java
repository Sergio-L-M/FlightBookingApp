package flightbooking.com.backend.utils;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import flightbooking.com.backend.services.AmadeusAirportService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AmadeusExtractGeneralData {
    private final AmadeusAirportService amadeusAirportService;

    public AmadeusExtractGeneralData(AmadeusAirportService amadeusAirportService) {
        this.amadeusAirportService = amadeusAirportService;
    }

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
        
        String departureIATACode = firstSegment.path("departure").path("iataCode").asText("N/A");
        String arrivalIATACode = lastSegment.path("arrival").path("iataCode").asText("N/A");
        String departureTime = firstSegment.path("departure").path("at").asText("Unknown");
        String arrivalTime = firstSegment.path("departure").path("at").asText("Unknown");

        generalData.put("departureAirportIATACode", departureIATACode);
        generalData.put("arrivalAirportIATACode", arrivalIATACode);

        generalData.put("flightSchedule",
        departureTime + " → " + arrivalTime);

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

    /**
     * Obtiene el nombre del aeropuerto y lo concatena con el código IATA.
     * Si el aeropuerto no se encuentra, solo devuelve el código IATA.
     */

}
