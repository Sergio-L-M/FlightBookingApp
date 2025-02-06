package flightbooking.com.backend.utils;

import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import flightbooking.com.backend.utils.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.Iterator;

class AmadeusExtractItinerariesTest {

    private AmadeusExtractItineraries amadeusExtractItineraries;
    private JsonNode mockFlightData;
    private JsonNode validData;
    private JsonNode dictionary;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws IOException {
        amadeusExtractItineraries = new AmadeusExtractItineraries();

        // ✅ Cargar mockData.json
        File mockFile = new File("src/test/resources/mockData.json");
        JsonNode rootNode = objectMapper.readTree(mockFile);
        dictionary = rootNode.path("dictionaries");
        mockFlightData = rootNode.path("data").get(1);  // Tomamos el primer vuelo

        // ✅ Cargar validMockData.json (output validado)
        File validFile = new File("src/test/resources/validMockData.json");
        validData = objectMapper.readTree(validFile).path(1).path("itineraries"); // Extraemos solo "itineraries"
    }

    
    @Test
    void testExtractItineraries_ValidOutput() {
        ObjectMapper objectMapper = new ObjectMapper(); // Instancia de Jackson
    
        // ✅ Ejecutar el método bajo prueba
        List<Map<String, Object>> itineraryResult = amadeusExtractItineraries.get(mockFlightData, dictionary);
    
        // ✅ Extraer los datos generados y esperados
       
        JsonNode expectedItineraries = validData; // `validData` ya es un JsonNode con "itineraries"
    
        // ✅ Verificar tamaño de los itinerarios
        assertEquals(expectedItineraries.size(), itineraryResult.size(), "❌ Mismatch in the number of itineraries");
    
        // ✅ Iterar sobre los itinerarios esperados
        for (int i = 0; i < expectedItineraries.size(); i++) {
            JsonNode expectedItinerary = expectedItineraries.get(i);
            Map<String, Object> generatedItinerary = itineraryResult.get(i);
    
            // ✅ Convertir ambos a JSON para evitar diferencias de formato
            JsonNode generatedJson = objectMapper.valueToTree(generatedItinerary);
    
            // 🔍 Imprimir JSON antes de comparar
            System.out.println("🔍 Comparando itinerario #" + (i + 1));
            System.out.println("✅ Expected JSON: " + expectedItinerary.toPrettyString());
            System.out.println("✅ Generated JSON: " + generatedJson.toPrettyString());
    
            // ✅ Iteramos sobre todas las claves del expectedItinerary
            Iterator<String> fieldNamesIterator = expectedItinerary.fieldNames();
            while (fieldNamesIterator.hasNext()) {
                String key = fieldNamesIterator.next();
    
                // 🔍 Imprimir la clave que estamos comparando
                System.out.println("🔍 Comparando clave: " + key);
    
                // ❌ Verificar si la clave está en el resultado generado
                if (!generatedItinerary.containsKey(key)) {
                    System.out.println("❌ Clave faltante en generatedItinerary: " + key);
                    fail("❌ Missing key: " + key);
                }
    
                // ✅ Obtener valores esperados y generados
                JsonNode expectedNode = expectedItinerary.get(key);
                Object generatedValue = generatedItinerary.get(key);
    
                // 🔍 Imprimir valores antes de comparar
                System.out.println("✅ Expected: " + expectedNode);
                System.out.println("✅ Generated: " + generatedValue);
    
                // ✅ Convertir ambos valores a JSON para comparación robusta
                JsonNode expectedJsonValue = objectMapper.valueToTree(expectedNode);
                JsonNode generatedJsonValue = objectMapper.valueToTree(generatedValue);
    
                // ✅ Comparar valores
                assertEquals(expectedJsonValue, generatedJsonValue, "❌ Incorrect value for key: " + key);
            }
        }
    }
}
