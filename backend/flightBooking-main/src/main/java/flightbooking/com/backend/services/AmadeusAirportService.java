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
    private final Map<String, String> airportCache = new ConcurrentHashMap<>();
    private static final long COOLDOWN_TIME_MS = 500;
    private long lastRequestTime = 0;

    public AmadeusAirportService(AmadeusAuthService authService) {
        this.restTemplate = new RestTemplate();
        this.authService = authService;
    }

    public String getCachedOrFetchAirport(String iataCode) {
        // Verifica si ya está en caché
        if (airportCache.containsKey(iataCode)) {
            return airportCache.get(iataCode);
        }

        // Realiza la búsqueda en la API
        List<Map<String, String>> airports = searchAirports(iataCode);
        
        // Guarda en la caché el primer resultado o "NOT FOUND"
        String airportName = airports.isEmpty() ? "NOT FOUND" : airports.get(0).get("name");
        airportCache.put(iataCode, airportName);
        
        return airportName;
    }

    public List<Map<String, String>> searchAirports(String keyword) {
        enforceCooldown();

        String token = authService.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        String url = String.format(AIRPORT_SEARCH_URL, keyword);
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response;

        try {
            response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        } catch (Exception e) {
            System.out.println("Error fetching airport data for: " + keyword);
            return Collections.emptyList();
        }

        return extractAirports(response.getBody());
    }

    private void enforceCooldown() {
        long currentTime = System.currentTimeMillis();
        long timeSinceLastRequest = currentTime - lastRequestTime;

        if (timeSinceLastRequest < COOLDOWN_TIME_MS) {
            try {
                Thread.sleep(COOLDOWN_TIME_MS - timeSinceLastRequest);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        lastRequestTime = System.currentTimeMillis();
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
            System.out.println("Error parsing airport response");
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
