package flightbooking.com.backend.controllers;


import flightbooking.com.backend.services.AmadeusFlightService;
import flightbooking.com.backend.services.AmadeusRawService;
import flightbooking.com.backend.services.AmadeusAirportService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final AmadeusFlightService flightService;
    private final AmadeusRawService rawService;
    private final AmadeusAirportService airportService;

    // Base de datos en memoria (caché)
    private final Map<String, Map<String, Map<String, Object>>> flightCache = new ConcurrentHashMap<>();



    public FlightController(AmadeusFlightService flightService, AmadeusRawService rawService, AmadeusAirportService airportService) {
        this.flightService = flightService;
        this.rawService = rawService;
        this.airportService = airportService;
    }

    @GetMapping
    public List<Map<String, Object>> getFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String departureDate,
            @RequestParam(defaultValue = "USD") String currency,
            @RequestParam(defaultValue = "false") boolean nonStop,
            @RequestParam(defaultValue = "1") int adults,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) boolean ascending,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "2") int size) {
    
        // Generar clave única para la caché
        String cacheKey = generateCacheKey(origin, destination, departureDate, currency, nonStop, adults);
    
        // Verificar si los resultados ya están en caché
        if (flightCache.containsKey(cacheKey)) {
            System.out.println("Cache hit: " + cacheKey);
            List<Map<String, Object>> flights = convertToList(flightCache.get(cacheKey));
            List<Map<String, Object>> sortedFlights = sortFlights(flights, sortBy, ascending);
            return paginateList(sortedFlights, page, size);
        }
    
        // Llamar al servicio y guardar la respuesta en caché
        Map<String, Map<String, Object>> response = flightService.searchFlights(origin, destination, departureDate, currency, adults, nonStop);
        flightCache.put(cacheKey, response);
    
        System.out.println("Cache miss: " + cacheKey + " -> Guardando en caché");
        List<Map<String, Object>> flights = convertToList(response);
        List<Map<String, Object>> sortedFlights = sortFlights(flights, sortBy, ascending);
        return paginateList(sortedFlights, page, size);
    }
    
    @GetMapping("/{key}/{id}")
    public ResponseEntity<Object> getFlightByKeyAndId(
            @PathVariable String key,
            @PathVariable String id) {
    
        // Verificar si la clave principal (key) existe en la caché
        if (!flightCache.containsKey(key)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "No flights found for the given key: " + key));
        }
    
        // Obtener los vuelos almacenados bajo la clave principal
        Map<String, Map<String, Object>> flights = flightCache.get(key);
    
        // Verificar si el vuelo con el ID especificado existe dentro de esta clave
        if (!flights.containsKey(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Flight with ID " + id + " not found in key: " + key));
        }
    
        // Si existe, devolver el objeto del vuelo específico
        return ResponseEntity.ok(flights.get(id));
    }
    


    @GetMapping("/raw")
    public String getRawFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String departureDate,
            @RequestParam(defaultValue = "USD") String currency,
            @RequestParam(defaultValue = "false") boolean nonStop) {

        return rawService.getRawResponse(origin, destination, departureDate, currency, nonStop);
    }

    @GetMapping("/airports")
    public List<Map<String, String>> getAirports(
            @RequestParam String keyword) {
        return airportService.searchAirports(keyword);
    }

    // Método para generar una clave única en la caché
    private String generateCacheKey(String origin, String destination, String departureDate, String currency, boolean nonStop, int adults) {
        return origin + "-" + destination + "-" + departureDate + "-" + currency + "-" + nonStop + "-" + adults;
    }

    private List<Map<String, Object>> convertToList(Map<String, Map<String, Object>> data) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> entry : data.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", entry.getKey()); // Agregar el ID como un campo en cada objeto
            item.putAll(entry.getValue()); // Agregar el contenido del objeto
            list.add(item);
        }
        return list;
    }
    private List<Map<String, Object>> sortFlights(List<Map<String, Object>> flights, String sortBy, boolean ascending) {
        if (sortBy == null || sortBy.isEmpty()) {
            System.out.println("SortBy is null or empty");
            return flights; // No ordenar si no se especifica
        }
    
        System.out.println("Sorting by: " + sortBy.toLowerCase());
    
        // Hacer una copia de la lista original para no modificar la caché
        List<Map<String, Object>> sortedFlights = new ArrayList<>(flights);
    
        Comparator<Map<String, Object>> comparator = null;
    
        switch (sortBy.toLowerCase()) {
            case "cheapest":
                comparator = Comparator.comparing(flight -> {
                    Map<String, Object> generalData = getSafeMap(flight, "generalData");
                    return parseDoubleSafe(generalData.get("totalPrice"));
                }, Comparator.reverseOrder());
                break;
            case "most_expensive":
                comparator = Comparator.comparing(flight -> {
                    Map<String, Object> generalData = getSafeMap(flight, "generalData");
                    return parseDoubleSafe(generalData.get("totalPrice"));
                });
                break;
            case "shortest":
                comparator = Comparator.comparing(flight -> {
                    Map<String, Object> generalData = getSafeMap(flight, "generalData");
                    return parseDurationSafe(generalData.get("totalDuration"));
                }, Comparator.reverseOrder());
                break;
            case "longest":
                comparator = Comparator.comparing(flight -> {
                    Map<String, Object> generalData = getSafeMap(flight, "generalData");
                    return parseDurationSafe(generalData.get("totalDuration"));
                });
                break;
            default:
                System.out.println("Invalid sortBy parameter: " + sortBy);
                return flights; // Si el sortBy no es válido, devolver la lista sin cambios
        }
    
        // Aplicar la ordenación
        sortedFlights.sort(comparator);
        
        // Si se especifica orden descendente, invertir la lista
        if (!ascending) {
            Collections.reverse(sortedFlights);
        }
    
        return sortedFlights;
    }
    
    // Método seguro para obtener un Map evitando cast exception
    private Map<String, Object> getSafeMap(Map<String, Object> parentMap, String key) {
        Object value = parentMap.get(key);
        if (value instanceof Map) {
            return (Map<String, Object>) value;
        }
        return new HashMap<>(); // Devolver mapa vacío si el valor es null o no es un mapa
    }
    
    // Método seguro para convertir `totalPrice` en un número doble
    private double parseDoubleSafe(Object value) {
        if (value == null) {
            return Double.MAX_VALUE; // Si es nulo, enviamos un valor alto para que vaya al final
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            System.out.println("Error parsing double: " + value);
            return Double.MAX_VALUE; // Si hay un error, poner al final de la lista
        }
    }
    
    // Método seguro para convertir `totalDuration` ("24H 10M") en minutos totales
    private int parseDurationSafe(Object value) {
        if (value == null) {
            return Integer.MAX_VALUE; // Si es nulo, enviamos un valor alto para que vaya al final
        }
        try {
            return parseDuration(value.toString());
        } catch (Exception e) {
            System.out.println("Error parsing duration: " + value);
            return Integer.MAX_VALUE; // Si hay error, enviarlo al final
        }
    }
    
    // Método para convertir "24H 10M" en minutos totales
    private int parseDuration(String duration) {
        String[] parts = duration.split(" ");
        int totalMinutes = 0;
        for (String part : parts) {
            if (part.endsWith("H")) {
                totalMinutes += Integer.parseInt(part.replace("H", "")) * 60;
            } else if (part.endsWith("M")) {
                totalMinutes += Integer.parseInt(part.replace("M", ""));
            }
        }
        return totalMinutes;
    }
    private List<Map<String, Object>> paginateList(List<Map<String, Object>> flights, int page, int size) {
        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, flights.size());
    
        if (fromIndex >= flights.size()) {
            return new ArrayList<>(); // Si la página está fuera de rango, devolver lista vacía
        }
    
        return flights.subList(fromIndex, toIndex);
    }
    
}
