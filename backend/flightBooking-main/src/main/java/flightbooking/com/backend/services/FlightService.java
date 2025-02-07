
package flightbooking.com.backend.services;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;



@Service
public class FlightService {
    // Base de datos en memoria (caché)
    private final Map<String, Map<String, Map<String, Object>>> flightCache = new ConcurrentHashMap<>();

    public Map<String, Object> getFlights(
        String origin, String destination, String departureDate, String currency,
        boolean nonStop, int adults, String sortBy, boolean ascending, int page, int size,
        AmadeusFlightService flightService, AmadeusAirportService airportService) {
    
        String cacheKey = generateCacheKey(origin, destination, departureDate, currency, nonStop, adults);
    
        List<Map<String, Object>> flights;
        
        if (flightCache.containsKey(cacheKey)) {
            flights = convertToList(flightCache.get(cacheKey));
        } else {
            Map<String, Map<String, Object>> response = flightService.searchFlights(origin, destination, departureDate, currency, adults, nonStop);
            flightCache.put(cacheKey, response);
            flights = convertToList(response);
        }
    
        // Ordenar la lista de vuelos
        List<Map<String, Object>> sortedFlights = sortFlights(flights, sortBy);
    
        // Calcular el total de páginas
        int totalFlights = sortedFlights.size();
        int totalPages = (int) Math.ceil((double) totalFlights / size);
    
        // Paginar la lista de vuelos
        List<Map<String, Object>> paginatedFlights = paginateList(sortedFlights, page, size);
    
        // Agregar nombres de aeropuertos
        addAirportNamesToFlights(cacheKey, paginatedFlights, airportService);
    
        // Crear el resultado final
        Map<String, Object> result = new HashMap<>();
        result.put("totalPages", totalPages);
        result.put("flights", filterFlights(paginatedFlights));
    
        return result;
    }
    

    public static List<Map<String, Object>> filterFlights(List<Map<String, Object>> paginatedFlights) {
        return paginatedFlights.stream()
            .map(flight -> Map.of(
                "id", flight.get("id"),
                "generalData", flight.get("generalData")
            ))
            .collect(Collectors.toList());
    }




    public List<Map<String, Object>> sortFlights(List<Map<String, Object>> flights, String sortBy) {
        if (flights == null || flights.isEmpty()) {
            return Collections.emptyList(); // Devolver lista vacía en lugar de null
        }
    
        if (sortBy == null || sortBy.isEmpty()) {
            return flights;
        }

        List<Map<String, Object>> sortedFlights = new ArrayList<>(flights);
        Comparator<Map<String, Object>> comparator = null;

        switch (sortBy.toLowerCase()) {
            case "cheapest":
                comparator = Comparator.comparing(flight -> parseDoubleSafe(getSafeMap(flight, "generalData").get("totalPrice")));
                break;
            case "most_expensive":
                comparator = Comparator.comparing(flight -> parseDoubleSafe(getSafeMap(flight, "generalData").get("totalPrice")), Comparator.reverseOrder());
                break;
            case "shortest":
                comparator = Comparator.comparing(flight -> parseDurationSafe(getSafeMap(flight, "generalData").get("totalDuration")));
                break;
            case "longest":
                comparator = Comparator.comparing(flight -> parseDurationSafe(getSafeMap(flight, "generalData").get("totalDuration")), Comparator.reverseOrder());
                break;
            default:
                return flights;
        }

        sortedFlights.sort(comparator);
        return sortedFlights;
    }
    private void addAirportNamesToFlights(String cacheKey, List<Map<String, Object>> flights, AmadeusAirportService airportService) {
        for (Map<String, Object> flight : flights) {
            Map<String, Object> generalData = getSafeMap(flight, "generalData");

            updateAirportName(generalData, "departureAirportCode", "departureAirportName", airportService);
            updateAirportName(generalData, "arrivalAirportCode", "arrivalAirportName", airportService);

            List<Map<String, String>> stops = new ArrayList<>();
            List<Map<String, Object>> itineraries = (List<Map<String, Object>>) flight.get("itineraries");
            if (itineraries != null) {
                for (Map<String, Object> itinerary : itineraries) {
                    Map<String, String> stop = new HashMap<>();
                    //System.out.println("Iterando sobre itinerarios: " + flight.get("itineraries"));
                    updateAirportName(itinerary, "departureAirportCode", "departureAirportName", airportService);
                    updateAirportName(itinerary, "arrivalAirportCode", "arrivalAirportName", airportService);
                    String layoverTimeStr = (String) itinerary.getOrDefault("layoverTime", "0H 0M");
                    stop.put("layoverTime", layoverTimeStr);
                    stop.put("arrivalAirportName", (String) itinerary.get("arrivalAirportName"));
                    stop.put("arrivalAirportCode", (String) itinerary.get("arrivalAirportCode"));
                    stops.add(stop);
                
                }
            }
            generalData.put("stops", stops);

          
            Map<String, Map<String, Object>> flightCacheEntry = flightCache.get(cacheKey);
            if (flightCacheEntry != null) {
                flightCacheEntry.put(flight.get("id").toString(), flight);
            }
        }
    }

    private void updateAirportName(Map<String, Object> data, String codeKey, String nameKey, AmadeusAirportService airportService) {
        if (data == null || !data.containsKey(codeKey)) return;

        String airportCode = data.getOrDefault(codeKey, "").toString();
        if (airportCode.isEmpty()) return;

        String airportName = airportService.getCachedOrFetchAirport(airportCode);
        data.put(nameKey, airportName);
    }

    public ResponseEntity<Object> getFlightByKeyAndId(String key, String id) {
        if (!flightCache.containsKey(key)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "No flights found for the given key: " + key));
        }

        Map<String, Map<String, Object>> flights = flightCache.get(key);
        if (!flights.containsKey(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Flight with ID " + id + " not found in key: " + key));
        }

        return ResponseEntity.ok(flights.get(id));
    }

    private String generateCacheKey(String origin, String destination, String departureDate, String currency, boolean nonStop, int adults) {
        return origin + "-" + destination + "-" + departureDate + "-" + currency + "-" + nonStop + "-" + adults;
    }

    private List<Map<String, Object>> convertToList(Map<String, Map<String, Object>> data) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> entry : data.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", entry.getKey());
            item.putAll(entry.getValue());
            list.add(item);
        }
        return list;
    }

    private List<Map<String, Object>> paginateList(List<Map<String, Object>> flights, int page, int size) {
        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, flights.size());

        if (fromIndex >= flights.size()) {
            return new ArrayList<>();
        }

        return flights.subList(fromIndex, toIndex);
    }

    private Map<String, Object> getSafeMap(Map<String, Object> parentMap, String key) {
        Object value = parentMap.get(key);
        return (value instanceof Map) ? (Map<String, Object>) value : new HashMap<>();
    }

    private double parseDoubleSafe(Object value) {
        if (value == null) return Double.MAX_VALUE;
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return Double.MAX_VALUE;
        }
    }

    private int parseDurationSafe(Object value) {
        if (value == null) return Integer.MAX_VALUE;
        try {
            return parseDuration(value.toString());
        } catch (Exception e) {
            return Integer.MAX_VALUE;
        }
    }

    private int parseDuration(String duration) {
        String[] parts = duration.split(" ");
        int totalMinutes = 0;
        for (String part : parts) {
            if (part.endsWith("H")) totalMinutes += Integer.parseInt(part.replace("H", "")) * 60;
            else if (part.endsWith("M")) totalMinutes += Integer.parseInt(part.replace("M", ""));
        }
        return totalMinutes;
    }
}
