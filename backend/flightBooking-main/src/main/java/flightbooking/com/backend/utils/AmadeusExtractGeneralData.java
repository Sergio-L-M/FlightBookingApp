package flightbooking.com.backend.utils;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.regex.*;

@Component
public class AmadeusExtractGeneralData {

    public Map<String, Object> extractGeneralData(List<Map<String, Object>> data, Map<String, Object> priceData) {
        Map<String, Object> generalData = new HashMap<>();
        Map<String, Object> departureFlight = data.get(0);
        Map<String, Object> arrivalFlight = data.get(data.size() - 1);

        generalData.put("departureAirportCode", departureFlight.get("departureAirportCode"));
        generalData.put("departureAirportName", "");
        generalData.put("arrivalAirportCode", arrivalFlight.get("arrivalAirportCode"));
        generalData.put("arrivalAirportName", "");
        generalData.put("flightSchedule", 
                departureFlight.get("departureTime") + " → " + arrivalFlight.get("arrivalTime"));

        int totalMinutes = 0;
        List<Map<String, String>> stops = new ArrayList<>();
        for (Map<String, Object> segment : data) {
            Map<String, String> stop = new HashMap<>();

            String layoverTimeStr = (String) segment.getOrDefault("layoverTime", "0H 0M");
            String durationStr = (String) segment.getOrDefault("duration", "0H 0M");

            int layoverMinutes = parseTimeToMinutes(layoverTimeStr);
            int durationMinutes = parseTimeToMinutes(durationStr);

            totalMinutes += layoverMinutes + durationMinutes;

            stop.put("layoverTime", layoverTimeStr);
            stop.put("arrivalAirport", (String) segment.get("arrivalAirport"));

            stops.add(stop);
        }
        
        String totalDurationFormatted = formatMinutesToHours(totalMinutes);
        generalData.put("totalDuration", totalDurationFormatted);
        generalData.put("stops", stops);
        generalData.put("currency",  priceData.get("currency"));
        generalData.put("totalPrice", priceData.get("total"));
        generalData.put("airline", departureFlight.get("airline"));
        generalData.put("operatingAirline", departureFlight.get("operatingAirline"));
        generalData.put("PricePerTraveler", priceData.get("pricePerTraveler"));

        return generalData;
    }

    private int parseTimeToMinutes(String timeStr) {
        if (timeStr == null || timeStr.isEmpty()) return 0;

        Pattern pattern = Pattern.compile("(\\d+)H\\s*(\\d+)?M?");
        Matcher matcher = pattern.matcher(timeStr);

        int hours = 0, minutes = 0;
        if (matcher.find()) {
            hours = Integer.parseInt(matcher.group(1));
            if (matcher.group(2) != null) {
                minutes = Integer.parseInt(matcher.group(2));
            }
        }
        return (hours * 60) + minutes;
    }
    
    private String formatMinutesToHours(int totalMinutes) {
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;
        return String.format("%dH %dM", hours, minutes);
    }
}
