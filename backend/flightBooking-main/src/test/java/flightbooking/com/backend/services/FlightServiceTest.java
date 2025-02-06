package flightbooking.com.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

class FlightServiceTest {

    private FlightService flightService;
    private ObjectMapper objectMapper;
    private List<Map<String, Object>> mockFlights;

    @BeforeEach
    void setUp() throws IOException {
        flightService = new FlightService();
        objectMapper = new ObjectMapper();
    
        // Cargar JSON como lista directamente
        File mockFile = new File("src/test/resources/validMockData.json");
        
        mockFlights = objectMapper.readValue(mockFile, new TypeReference<List<Map<String, Object>>>() {});
        
        // Debug: Verificar si la lista no está vacía
        if (mockFlights == null || mockFlights.isEmpty()) {
            throw new IllegalStateException("Error: mockFlights es null o está vacío.");
        }
    }
    
    
    

    private void testSorting(String sortBy, String expectedFile) throws IOException {
      
        List<Map<String, Object>> sortedFlights = flightService.sortFlights(mockFlights, sortBy);
    
        File expectedJsonFile = new File("src/test/resources/sortList/" + expectedFile);
        List<Map<String, Object>> expectedFlights = objectMapper.readValue(expectedJsonFile, new TypeReference<>() {});
    
        assertEquals(expectedFlights, sortedFlights, "Error en la ordenación: " + sortBy);
    }
    
    @Test
    void testSortCheapest() throws IOException {
        testSorting("cheapest", "validCheapest.json");
    }

    @Test
    void testSortMostExpensive() throws IOException {
        testSorting("most_expensive", "validMostExpensive.json");
    }

    @Test
    void testSortShortest() throws IOException {
        testSorting("shortest", "validShortest.json");
    }

    @Test
    void testSortLongest() throws IOException {
        testSorting("longest", "validLongest.json");
    }
}
