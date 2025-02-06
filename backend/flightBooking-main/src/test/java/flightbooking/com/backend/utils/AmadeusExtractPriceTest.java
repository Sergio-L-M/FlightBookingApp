package flightbooking.com.backend.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import static org.junit.jupiter.api.Assertions.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
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
    ObjectMapper objectMapper = new ObjectMapper();

    // ✅ Cargar mockData.json usando ClassLoader
    InputStream mockFileStream = getClass().getClassLoader().getResourceAsStream("mockData.json");
    if (mockFileStream == null) {
        throw new FileNotFoundException("❌ mockData.json no encontrado en classpath");
    }
    
    // ✅ Leer el archivo y convertirlo en JsonNode
    JsonNode rootNode = objectMapper.readTree(mockFileStream);
    System.out.println("📄 Contenido de mockData.json:\n" + rootNode.toPrettyString());

    // ✅ Extraer los datos necesarios
    mockFlightData = rootNode.path("data").get(0);

    // ✅ Cargar validMockData.json usando ClassLoader
    InputStream expectedFileStream = getClass().getClassLoader().getResourceAsStream("validMockData.json");
    if (expectedFileStream == null) {
        throw new FileNotFoundException("❌ validMockData.json no encontrado en classpath");
    }

    // ✅ Leer el archivo y convertirlo en JsonNode
    JsonNode expectedRootNode = objectMapper.readTree(expectedFileStream);
    System.out.println("📄 Contenido de validMockData.json:\n" + expectedRootNode.toPrettyString());

    // ✅ Extraer los datos necesarios
    expectedData = expectedRootNode.path(0).path("price");
}

    @Test
    void testExtractPrice() {
        // ✅ Ejecutar el método bajo prueba
        Map<String, Object> priceData = amadeusExtractPrice.get(mockFlightData);

        // ✅ Asegurar que el resultado no es nulo
        assertNotNull(priceData, "❌ El mapa priceData es nulo");

        Iterator<String> fieldNamesIterator = expectedData.fieldNames();
        while (fieldNamesIterator.hasNext()) {
            String key = fieldNamesIterator.next();
            if (!priceData.containsKey(key)) {
                System.out.println("❌ Clave faltante en priceData: " + key);
                fail("❌ Missing key: " + key);
            }

        }
    }


}
