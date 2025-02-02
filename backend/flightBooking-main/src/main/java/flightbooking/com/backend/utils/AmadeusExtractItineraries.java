package flightbooking.com.backend.utils;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class AmadeusExtractItineraries {
    public Map<String, Object> get(JsonNode flight) {
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
            segmentInfo.put("departureAirport", segment.get("departure").get("iataCode").asText());
            segmentInfo.put("departureTime", segment.get("departure").get("at").asText());
            segmentInfo.put("arrivalAirport", segment.get("arrival").get("iataCode").asText());
            segmentInfo.put("arrivalTime", segment.get("arrival").get("at").asText());
            segmentInfo.put("airline", segment.get("carrierCode").asText());
            segmentInfo.put("flightNumber", segment.get("number").asText());
            segmentInfo.put("aircraft", segment.get("aircraft").get("code").asText());
    
            if (segment.has("operating") && segment.get("operating").has("carrierCode")) {
                segmentInfo.put("operatingAirline", segment.get("operating").get("carrierCode").asText());
            }
    
            segmentInfo.put("duration", segment.get("duration").asText());
            String durationString = segment.get("duration").asText();
            totalDuration = totalDuration.plus(parseDuration(durationString));
    
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
    
        Map<String, Object> result = new HashMap<>();
        result.put("itineraries", itineraryDetails);
        result.put("totalDuration", String.format("%dH %dM", totalDuration.toHours(), totalDuration.toMinutesPart()));
        
        return result;
    }
   
    private String calculateLayoverTime(String arrivalTime, String nextDepartureTime) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime arrival = LocalDateTime.parse(arrivalTime, formatter);
            LocalDateTime nextDeparture = LocalDateTime.parse(nextDepartureTime, formatter);
            Duration layoverDuration = Duration.between(arrival, nextDeparture);

            return String.format("%dH %dM", layoverDuration.toHours(), layoverDuration.toMinutesPart());
        } catch (Exception e) {
            return "N/A";
        }
    }
    private Duration parseDuration(String duration) {
        return Duration.parse(duration);
    }
}
