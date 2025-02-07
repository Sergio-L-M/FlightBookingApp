package flightbooking.com.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class AmadeusAirlineService {

    private static final String AIRLINE_INFO_URL = "https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=";
    private final RestTemplate restTemplate;
    private final AmadeusAuthService authService;

    public AmadeusAirlineService(AmadeusAuthService authService) {
        this.restTemplate = new RestTemplate();
        this.authService = authService;
    }

    public Map<String, String> getAirlineInfo(String iataCode) {
        String token = authService.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        
        String url = AIRLINE_INFO_URL + iataCode;
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        
        return extractAirlineInfo(response.getBody());
    }

    private Map<String, String> extractAirlineInfo(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode data = root.path("data");
            
            if (data.isArray() && data.size() > 0) {
                JsonNode airline = data.get(0);
                Map<String, String> airlineInfo = new HashMap<>();
                airlineInfo.put("iataCode", airline.path("iataCode").asText());
                airlineInfo.put("businessName", airline.path("businessName").asText());
                airlineInfo.put("commonName", airline.path("commonName").asText());
                return airlineInfo;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new HashMap<>();
    }
}
