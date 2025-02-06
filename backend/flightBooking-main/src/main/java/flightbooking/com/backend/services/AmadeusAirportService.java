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
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AmadeusAirportService {
    private static final String AIRPORT_SEARCH_URL = "https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=%s";
    private final RestTemplate restTemplate;
    private final AmadeusAuthService authService;
    
    // Caché en memoria sin expiración
    private final Map<String, List<Map<String, String>>> airportCache = new ConcurrentHashMap<>();

    public AmadeusAirportService(AmadeusAuthService authService) {
        this.restTemplate = new RestTemplate();
        this.authService = authService;
    }

    public List<Map<String, String>> searchAirports(String keyword) {
        // Verifica si el resultado ya está en caché
        if (airportCache.containsKey(keyword)) {
            return airportCache.get(keyword);
        }

        // Si no está en caché, realiza la solicitud a la API
        String token = authService.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        String url = String.format(AIRPORT_SEARCH_URL, keyword);
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        List<Map<String, String>> airports = extractAirports(response.getBody());

        // Almacena el resultado en caché
        airportCache.put(keyword, airports);

        return airports;
    }

    private List<Map<String, String>> extractAirports(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode data = root.path("data");
            List<Map<String, String>> airports = new ArrayList<>();

            for (JsonNode airport : data) {
                if ("AIRPORT".equals(airport.path("subType").asText())) {
                    Map<String, String> airportInfo = new HashMap<>();
                    airportInfo.put("code", airport.path("iataCode").asText());
                    airportInfo.put("name", airport.path("name").asText());
                    airports.add(airportInfo);
                }
            }
            return airports;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
