package flightbooking.com.backend.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import static org.junit.jupiter.api.Assertions.*;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Iterator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class AmadeusExtractPriceTest {
    private AmadeusExtractPrice amadeusExtractPrice;
    private JsonNode mockFlightData;
    private JsonNode expectedData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws IOException {
        amadeusExtractPrice = new AmadeusExtractPrice();

        // ✅ Cargar el archivo mockData.json con datos de Amadeus
        File mockFile = new File("src/test/resources/mockData.json");
        JsonNode rootNode = objectMapper.readTree(mockFile);
        mockFlightData = rootNode.path("data").get(0); // Tomamos el primer vuelo

        // ✅ Cargar el archivo expectedMockData.json con el output esperado
        File expectedFile = new File("src/test/resources/validMockData.json");
        expectedData = objectMapper.readTree(expectedFile)
                .path(0) // Tomamos el primer vuelo esperado
                .path("price"); // Extraemos solo la sección de priceData
    }
    @Test
    void testExtractPrice() {
        // ✅ Ejecutar el método bajo prueba
        Map<String, Object> priceData = amadeusExtractPrice.get(mockFlightData);

        // ✅ Asegurar que el resultado no es nulo
        assertNotNull(priceData, "❌ El mapa priceData es nulo");

        // ✅ Convertir el resultado generado a JSON para comparación uniforme
        JsonNode generatedJson = objectMapper.valueToTree(priceData);

        // 🔍 Imprimir JSON antes de comparar (para debugging)
        System.out.println("🔍 Expected JSON: " + expectedData.toPrettyString());
        System.out.println("🔍 Generated JSON: " + generatedJson.toPrettyString());

        // ✅ Iterar sobre todas las claves esperadas y verificar que existen en los datos generados
        Iterator<String> fieldNamesIterator = expectedData.fieldNames();
        while (fieldNamesIterator.hasNext()) {
            String key = fieldNamesIterator.next();
            if (key.equals("totalDuration")) {
                System.out.println("⚠️ Saltando validación para la clave: " + key);
                continue;
            }

            // 🔍 Imprimir la clave que estamos comparando
            System.out.println("🔍 Comparando clave: " + key);

            // ❌ Verificar si la clave está en el resultado generado
            if (!priceData.containsKey(key)) {
                System.out.println("❌ Clave faltante en priceData: " + key);
                fail("❌ Missing key: " + key);
            }

            // ✅ Obtener valores esperados y generados
            JsonNode expectedNode = expectedData.get(key);
            Object generatedValue = priceData.get(key);

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
