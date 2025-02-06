package flightbooking.com.backend.controllers;

import flightbooking.com.backend.services.AmadeusFlightService;
import flightbooking.com.backend.services.FlightService;
import flightbooking.com.backend.services.AmadeusRawService;
import flightbooking.com.backend.services.AmadeusAirportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;
    private final AmadeusFlightService amadeusFlightService;
    private final AmadeusRawService rawService;
    private final AmadeusAirportService airportService;

    public FlightController(FlightService flightService, AmadeusFlightService amadeusFlightService,
                            AmadeusRawService rawService, AmadeusAirportService airportService) {
        this.flightService = flightService;
        this.amadeusFlightService = amadeusFlightService;
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
            @RequestParam(required = false, defaultValue = "true") boolean ascending,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
    
        // Llamar a FlightService con todos los parámetros requeridos
        return flightService.getFlights(
                origin, destination, departureDate, currency, nonStop, adults,
                sortBy, ascending, page, size, amadeusFlightService, airportService
        );
    }
    

    @GetMapping("/{key}/{id}")
    public ResponseEntity<Object> getFlightByKeyAndId(@PathVariable String key, @PathVariable String id) {
        return flightService.getFlightByKeyAndId(key, id);
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
}

