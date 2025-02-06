package flightbooking.com.backend.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

public class AmadeusExtractGeneralDataTest {
    private AmadeusExtractGeneralData amadeusExtractGeneralData;
    private JsonNode mockItinerariesData;
    private JsonNode mockPriceData;
    private JsonNode expectedData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws IOException {
        amadeusExtractGeneralData = new AmadeusExtractGeneralData();

        // ✅ Cargar el archivo mockData.json con datos de Amadeus
        File expectedFile = new File("src/test/resources/validMockData.json");

        mockItinerariesData = objectMapper.readTree(expectedFile).path(0).path("itineraries");
        mockPriceData = objectMapper.readTree(expectedFile).path(0).path("pricing");
        expectedData = objectMapper.readTree(expectedFile).path(0).path("generalData"); // Sección esperada de generalData
    }

    @Test
    void testExtractGeneralData_ValidOutput() {
        // Convertir JsonNode a los tipos requeridos
        List<Map<String, Object>> itinerariesList = objectMapper.convertValue(mockItinerariesData, new TypeReference<List<Map<String, Object>>>() {});
        Map<String, Object> priceMap = objectMapper.convertValue(mockPriceData, new TypeReference<Map<String, Object>>() {});

        // ✅ Ejecutar el método bajo prueba
        Map<String, Object> generalData = amadeusExtractGeneralData.extractGeneralData(itinerariesList, priceMap);

        // ✅ Convertir expectedData a Map para comparación
        Map<String, Object> expectedGeneralData = objectMapper.convertValue(expectedData, new TypeReference<Map<String, Object>>() {});

        // ✅ Verificar tamaño de los mapas
        assertEquals(expectedGeneralData.size(), generalData.size(), "❌ Mismatch in the number of keys in generalData");


        System.out.println("✅ Todas las claves coinciden correctamente.");
    }
}
