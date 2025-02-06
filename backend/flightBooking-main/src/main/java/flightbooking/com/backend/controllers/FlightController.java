package flightbooking.com.backend.controllers;


import flightbooking.com.backend.services.AmadeusFlightService;
import flightbooking.com.backend.services.AmadeusRawService;
import flightbooking.com.backend.services.AmadeusAirportService;
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
            @RequestParam(required = false) boolean ascending) {
    
        // Generar clave única para la caché
        String cacheKey = generateCacheKey(origin, destination, departureDate, currency, nonStop, adults);
    
        // Verificar si los resultados ya están en caché
        if (flightCache.containsKey(cacheKey)) {
            System.out.println("Cache hit: " + cacheKey);
            return convertToList(flightCache.get(cacheKey)); // Convertimos a lista antes de devolver
        }
    
        // Llamar al servicio y guardar la respuesta en caché
        Map<String, Map<String, Object>> response = flightService.searchFlights(origin, destination, departureDate, currency, adults, nonStop);
        flightCache.put(cacheKey, response);
    
        System.out.println("Cache miss: " + cacheKey + " -> Guardando en caché");
        return convertToList(response);
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
}
