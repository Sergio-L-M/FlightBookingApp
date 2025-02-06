package flightbooking.com.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.util.*;


import flightbooking.com.backend.utils.AmadeusExtractGeneralData;
import flightbooking.com.backend.utils.AmadeusExtractItineraries;
import flightbooking.com.backend.utils.AmadeusExtractPrice;
import flightbooking.com.backend.utils.SortFligths;
import flightbooking.com.backend.services.AmadeusAirportService;
import java.util.regex.*;
import java.time.Duration;

@Service
public class AmadeusFlightService {

    private static final String FLIGHT_SEARCH_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
    private final RestTemplate restTemplate;
    private final AmadeusAuthService authService;
    private final AmadeusExtractGeneralData amadeusExtractGeneralData;
    private final AmadeusExtractItineraries amadeusExtractItineraries;
    private final AmadeusExtractPrice amadeusExtractPrice;
    private final SortFligths sortFlights;
    private final AmadeusAirportService amadeusAirportService;
    private final String mockData;
   

    public AmadeusFlightService(AmadeusAuthService authService, 
                                AmadeusExtractGeneralData amadeusExtractGeneralData, 
                                AmadeusExtractItineraries amadeusExtractItineraries, 
                                SortFligths sortFlights, AmadeusExtractPrice amadeusExtractPrice,
                                AmadeusAirportService amadeusAirportService
                                ) {
        this.restTemplate = new RestTemplate();
        this.authService = authService;
        this.amadeusExtractGeneralData = amadeusExtractGeneralData;
        this.amadeusExtractItineraries = amadeusExtractItineraries;
        this.sortFlights = sortFlights;
        this.amadeusExtractPrice = amadeusExtractPrice;
        this.amadeusAirportService = amadeusAirportService;
        this.mockData = loadMockFlightData();
    }

    public  Map<String, Map<String, Object>> searchFlights(
            String origin, String destination, String departureDate, String currency,
            int adults, boolean nonStop) {

            boolean useMock = true; // Cambia esto para alternar entre mock y API real

            String responseBody;
            if (useMock) {
                responseBody = mockData; 
                
            } else {
                String token = authService.getAccessToken();
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + token);
                String url = FLIGHT_SEARCH_URL +
                        "?originLocationCode=" + origin +
                        "&destinationLocationCode=" + destination +
                        "&departureDate=" + departureDate +
                        "&adults=" + adults +
                        "&currencyCode=" + currency +
                        "&nonStop=" + nonStop;
        
                HttpEntity<String> request = new HttpEntity<>(headers);
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
                responseBody = response.getBody(); // Llamada real a la API
            }
            Map<String, Map<String, Object>> flights = transformResponse(responseBody);
        /*if (sortBy != null) {
            flights = sortFlights.set(flights, sortBy, ascending);
        }*/

        return flights;
    }

    public Map<String, Map<String, Object>> transformResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode data = root.path("data");
            JsonNode dictionary = root.path("dictionaries");
            Map<String, Map<String, Object>> flights = new HashMap<>();
    
            for (JsonNode flight : data) {
                String flightId = flight.get("id").asText(); // Convertir ID a String
                Map<String, Object> flightInfo = new HashMap<>();            
                List<Map<String, Object>> itineraryData = amadeusExtractItineraries.get(flight, dictionary);
                Map<String, Object> priceData = amadeusExtractPrice.get(flight);


                Map<String, Object> generalData = generalFlightData(itineraryData, priceData);
                flightInfo.put("generalData", generalData);
                flightInfo.put("itineraries", itineraryData);
                flightInfo.put("pricing", priceData);

                
                flights.put(flightId, flightInfo); // Usar el ID como clave en el Map
            }
            return flights;
    
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap(); // Retornar un Map vacío en caso de error
        }
    }
    

    private  Map<String, Object> generalFlightData(List<Map<String, Object>> data, Map<String, Object> priceData){
        Map<String, Object> generalData = new HashMap<>();
        Map<String, Object> departureFlight = data.get(0);
        Map<String, Object> arrivalFlight = data.get(data.size()-1);
        generalData.put("departureAirportCode", (String) departureFlight.get("departureAirportCode"));
        generalData.put("departureAirportName", "");
        generalData.put("arrivalAirportCode", (String) arrivalFlight.get("arrivalAirportCode"));
        generalData.put("arrivalAirportName", "");
        generalData.put("flightSchedule", 
        (String) departureFlight.get("departureTime") 
        + " → " + (String) arrivalFlight.get("arrivalTime"));

        int totalMinutes = 0;
        List<Map<String, String>> stops = new ArrayList<>();
        for (Map<String, Object> segment : data) {
            Map<String, String> stop = new HashMap<>();
        
            String layoverTimeStr = (String) segment.getOrDefault("layoverTime", "0H 0M");
            String durationStr = (String) segment.getOrDefault("duration", "0H 0M");
        
            int layoverMinutes = parseTimeToMinutes(layoverTimeStr);
            int durationMinutes = parseTimeToMinutes(durationStr);
        
            totalMinutes += layoverMinutes + durationMinutes; // ✅ Sumamos ambas duraciones
        
            stop.put("layoverTime", layoverTimeStr);
            stop.put("arrivalAirport", (String) segment.get("arrivalAirport"));
        
            stops.add(stop);
        }
        String totalDurationFormatted = formatMinutesToHours(totalMinutes);
        generalData.put("totalDuration", totalDurationFormatted);
        generalData.put("stops", stops);
        generalData.put("totalPrice", priceData.get("total"));
        generalData.put("airline",(String)departureFlight.get("airline"));
        generalData.put("operatingAirline",(String)departureFlight.get("operatingAirline"));
        generalData.put("PricePerTraveler", priceData.get("pricePerTraveler"));

        
        return generalData;

    }



    private String loadMockFlightData() {
        try {
            File mockFile = new File("src/test/resources/mockData.json");
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode mockRawData = objectMapper.readTree(mockFile);
            return objectMapper.writeValueAsString(mockRawData);
        } catch (IOException e) {
            e.printStackTrace();
            return "{}"; // Retornar un JSON vacío en caso de error
        }
    }

    private String getAirportName(String iataCode) {
        if ("N/A".equals(iataCode)) {
            return "Unknown";
        }

        List<Map<String, String>> airportData = amadeusAirportService.searchAirports(iataCode);

        // Busca el aeropuerto con el código IATA exacto
        for (Map<String, String> airport : airportData) {
            if (iataCode.equals(airport.get("code"))) {
                return iataCode + " - " + airport.get("name");
            }
        }

        return iataCode; // Si no se encuentra, solo devuelve el código IATA
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
