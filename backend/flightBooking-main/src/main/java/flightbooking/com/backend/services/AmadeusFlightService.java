package flightbooking.com.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.*;

import flightbooking.com.backend.utils.AmadeusExtractGeneralData;
import flightbooking.com.backend.utils.AmadeusExtractItineraries;
import flightbooking.com.backend.utils.SortFligths;
@Service
public class AmadeusFlightService {

    private static final String FLIGHT_SEARCH_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";
    private final RestTemplate restTemplate;
    private final AmadeusAuthService authService;
    private final AmadeusExtractGeneralData amadeusExtractGeneralData;
    private final AmadeusExtractItineraries amadeusExtractItineraries;
    private final SortFligths sortFlights;


    public AmadeusFlightService(AmadeusAuthService authService, 
    AmadeusExtractGeneralData amadeusExtractGeneralData, 
    AmadeusExtractItineraries amadeusExtractItineraries, 
    SortFligths sortFlights) {
        this.restTemplate = new RestTemplate();
        this.authService = authService;
        this.amadeusExtractGeneralData = amadeusExtractGeneralData;
        this.amadeusExtractItineraries =  amadeusExtractItineraries;
        this.sortFlights = sortFlights;
    }

    public List<Map<String, Object>> searchFlights(
            String origin, String destination, String departureDate, String currency,
            int adults, boolean nonStop, String sortBy, boolean ascending) {

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
        List<Map<String, Object>> flights = transformResponse(response.getBody());
        if (sortBy != null) {
            flights = sortFlights.set(flights, sortBy, ascending);
        }

        return flights;
    }

    public List<Map<String, Object>> transformResponse(String responseBody) {
        try {

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode data = root.path("data");
            List<Map<String, Object>> flights = new ArrayList<>();
    
            for (JsonNode flight : data) {
                Map<String, Object> flightInfo = new HashMap<>();
                flightInfo.put("id", UUID.randomUUID().toString());
                flightInfo.put("generalData", amadeusExtractGeneralData.get(flight));
                flightInfo.put("itineraries", amadeusExtractItineraries.get(flight));
                flights.add(flightInfo);
            }
            return flights;
    
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

        
}

