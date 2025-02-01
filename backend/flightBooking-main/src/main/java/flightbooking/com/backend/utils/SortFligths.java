package flightbooking.com.backend.utils;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.time.Duration;
import java.util.*;

@Service 
public class SortFligths {
    public List<Map<String, Object>> set(List<Map<String, Object>> flights, String sortBy, boolean ascending) {
        List<Map<String, Object>> sortedFlights;

        if (sortBy.equalsIgnoreCase("price")) {
            sortedFlights = flights.stream()
                    .sorted(Comparator.comparingDouble(flight -> extractPrice((String) flight.get("costPerTraveler"))))
                    .collect(Collectors.toList());
        } else if (sortBy.equalsIgnoreCase("duration")) {
            sortedFlights = flights.stream()
                    .sorted(Comparator.comparingLong(this::calculateFlightDuration)) // ✅ Ahora usamos `this`
                    .collect(Collectors.toList());
        } else {
            return flights;
        }

        if (!ascending) {
            Collections.reverse(sortedFlights);
        }

        return sortedFlights;
    }

    private static double extractPrice(String priceString) {
        if (priceString == null || priceString.isEmpty()) {
            return Double.MAX_VALUE; // Valor alto para evitar que un precio nulo esté en la parte superior del orden
        }
        return Double.parseDouble(priceString.split(" ")[0]);
    }
    
    private long calculateFlightDuration(Map<String, Object> flight) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    
        // Validar que los datos existen antes de acceder a ellos
        Map<String, String> departureAirport = (Map<String, String>) flight.get("departureAirport");
        Map<String, String> arrivalAirport = (Map<String, String>) flight.get("arrivalAirport");
    
        if (departureAirport == null || arrivalAirport == null) {
            return Long.MAX_VALUE; // Asigna un valor alto para evitar problemas en la comparación
        }
    
        String departureTimeStr = departureAirport.get("time");
        String arrivalTimeStr = arrivalAirport.get("time");
    
        if (departureTimeStr == null || arrivalTimeStr == null) {
            return Long.MAX_VALUE;
        }
    
        LocalDateTime departureTime = LocalDateTime.parse(departureTimeStr, formatter);
        LocalDateTime arrivalTime = LocalDateTime.parse(arrivalTimeStr, formatter);
    
        return Duration.between(departureTime, arrivalTime).toMinutes();
    }
    
}
