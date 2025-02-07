package flightbooking.com.backend.services;

import org.springframework.beans.factory.annotation.Value;
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

@Service
public class AmadeusFlightService {

    private static final String FLIGHT_SEARCH_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
    private final RestTemplate restTemplate;
    private final AmadeusAuthService authService;
    private final AmadeusExtractGeneralData amadeusExtractGeneralData;
    private final AmadeusExtractItineraries amadeusExtractItineraries;
    private final AmadeusExtractPrice amadeusExtractPrice;
    @Value("${flight.useMock}")
    private boolean useMock;
    
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
        this.amadeusExtractPrice = amadeusExtractPrice;
        this.mockData = loadMockFlightData();
    }


    public  Map<String, Map<String, Object>> searchFlights(
            String origin, String destination, String departureDate, String currency,
            int adults, boolean nonStop) {

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


                Map<String, Object> generalData = amadeusExtractGeneralData.extractGeneralData(itineraryData, priceData);
                flightInfo.put("generalData", generalData);
                flightInfo.put("itineraries", itineraryData);
                flightInfo.put("pricing", priceData);

                
                flights.put(flightId, flightInfo); 
            }
            return flights;
    
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap(); 
        }
    } 

    private String loadMockFlightData() {
        try {
            File mockFile = new File("src/test/resources/mockData.json");
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode mockRawData = objectMapper.readTree(mockFile);
            return objectMapper.writeValueAsString(mockRawData);
        } catch (IOException e) {
            e.printStackTrace();
            return "{}";
        }
    }    
    
}
