package flightbooking.com.backend.utils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class AmadeusExtractItineraries {

    public List<Map<String, Object>> get(JsonNode flight, JsonNode dictionary) {
        List<Map<String, Object>> itineraryDetails = new ArrayList<>();
        JsonNode itineraries = flight.get("itineraries").get(0);
        JsonNode segments = itineraries.get("segments");
        Duration totalDuration = Duration.ZERO;
        JsonNode travelerPricing = flight.get("travelerPricings").get(0);
        JsonNode fareDetails = travelerPricing.get("fareDetailsBySegment");

        for (int i = 0; i < segments.size(); i++) {
            JsonNode segment = segments.get(i);
            Map<String, Object> segmentInfo = new HashMap<>();
            String segmentId = segment.get("id").asText();

            segmentInfo.put("segmentId", segmentId);
            
            segmentInfo.put("departureAirportCode", segment.get("departure").get("iataCode").asText());
            segmentInfo.put("departureAirportName", "");
            segmentInfo.put("departureTime", segment.get("departure").get("at").asText());

            segmentInfo.put("arrivalAirportCode", segment.get("arrival").get("iataCode").asText());
            segmentInfo.put("arrivalAirportName", "");
            segmentInfo.put("arrivalTime", segment.get("arrival").get("at").asText());

            String airlineCode = segment.get("carrierCode").asText();
            String airlineName = dictionary.path("carriers").path(airlineCode).asText();
            segmentInfo.put("airline", airlineName.isEmpty() ? airlineCode : airlineCode + " - " + airlineName);

            segmentInfo.put("flightNumber", segment.get("number").asText());

            String aircraftCode = segment.get("aircraft").get("code").asText();
            String aircraftName = dictionary.path("aircraft").path(aircraftCode).asText();
            segmentInfo.put("aircraft", aircraftName.isEmpty() ? aircraftCode : aircraftCode + " - " + aircraftName);

            if (segment.has("operating") && segment.get("operating").has("carrierCode")) {
                String operatingCode = segment.get("operating").get("carrierCode").asText();
                String operatingName = dictionary.path("carriers").path(operatingCode).asText();
                segmentInfo.put("operatingAirline", operatingName.isEmpty() ? operatingCode : operatingCode + " - " + operatingName);
            }

            // ✅ Convertimos `duration` a "XH YM"
            String durationString = segment.get("duration").asText();
            Duration segmentDuration = parseDuration(durationString);
            String formattedDuration = formatDuration(segmentDuration);

            segmentInfo.put("duration", formattedDuration);
            totalDuration = totalDuration.plus(segmentDuration);

            for (JsonNode fareSegment : fareDetails) {
                if (fareSegment.get("segmentId").asText().equals(segmentId)) {
                    segmentInfo.put("cabin", fareSegment.get("cabin").asText());
                    segmentInfo.put("class", fareSegment.get("class").asText());
                    segmentInfo.put("fareBasis", fareSegment.get("fareBasis").asText());

                    Map<String, List<Map<String, Object>>> groupedAmenities = new HashMap<>();

                    if (fareSegment.has("amenities")) {
                        for (JsonNode amenity : fareSegment.get("amenities")) {
                            String type = amenity.get("amenityType").asText();
                            Map<String, Object> amenityInfo = new HashMap<>();
                            amenityInfo.put("description", amenity.get("description").asText());
                            amenityInfo.put("isChargeable", amenity.get("isChargeable").asBoolean());

                            groupedAmenities.computeIfAbsent(type, k -> new ArrayList<>()).add(amenityInfo);
                        }
                    }
                    segmentInfo.put("amenities", groupedAmenities);
                }
            }

            if (i < segments.size() - 1) {
                JsonNode nextSegment = segments.get(i + 1);
                String arrivalTime = segment.get("arrival").get("at").asText();
                String nextDepartureTime = nextSegment.get("departure").get("at").asText();
                segmentInfo.put("layoverTime", calculateLayoverTime(arrivalTime, nextDepartureTime));
            }

            itineraryDetails.add(segmentInfo);
        }

        // ✅ Convertimos `totalDuration` a "XH YM"
        String formattedTotalDuration = formatDuration(totalDuration);

        Map<String, Object> result = new HashMap<>();
        result.put("itineraries", itineraryDetails);
        result.put("totalDuration", formattedTotalDuration);

        return itineraryDetails;
    }

    // ✅ Convierte `PT11H10M` a `XH YM`
    private String formatDuration(Duration duration) {
        return String.format("%dH %dM", duration.toHours(), duration.toMinutesPart());
    }

    // ✅ Calcula el tiempo de espera entre vuelos
    private String calculateLayoverTime(String arrivalTime, String nextDepartureTime) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime arrival = LocalDateTime.parse(arrivalTime, formatter);
            LocalDateTime nextDeparture = LocalDateTime.parse(nextDepartureTime, formatter);
            Duration layoverDuration = Duration.between(arrival, nextDeparture);

            return formatDuration(layoverDuration);
        } catch (Exception e) {
            return "N/A";
        }
    }

    private Duration parseDuration(String duration) {
        return Duration.parse(duration);
    }
}
