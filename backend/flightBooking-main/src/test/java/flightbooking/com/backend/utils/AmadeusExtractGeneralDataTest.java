package flightbooking.com.backend.utils;

import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.core.JsonProcessingException;
import flightbooking.com.backend.utils.AmadeusExtractGeneralData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.io.IOException;
import java.util.Map;

class AmadeusExtractGeneralDataTest {

    private AmadeusExtractGeneralData amadeusExtractGeneralData;
    private JsonNode mockFlightData;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() throws IOException {
        amadeusExtractGeneralData = new AmadeusExtractGeneralData();
        
        // Cargar el archivo JSON (mockData.json) desde la carpeta de recursos
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);  // Para formatear la salida JSON
        File file = new File("src/test/resources/mockData.json");
        JsonNode rootNode = objectMapper.readTree(file);

        // Obtener solo el primer vuelo del "data" en el JSON
        mockFlightData = rootNode.path("data").get(0);
    }

    @Test
    void testExtractGeneralData_PrintOutputAndSave() throws IOException {
        // Ejecutar el método que estamos probando
        Map<String, Object> generalData = amadeusExtractGeneralData.get(mockFlightData, "");


        // ✅ Print en consola
        try {
            String jsonOutput = objectMapper.writeValueAsString(generalData);
            System.out.println("Generated General Data:");
            System.out.println(jsonOutput);

            // ✅ Guardar en validMockData.json para pruebas futuras
            File outputFile = new File("src/test/resources/validMockData.json");
            objectMapper.writeValue(outputFile, generalData);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            fail("Error al serializar el output de generalData");
        }

        // Verificar que el output no sea nulo
        assertNotNull(generalData);
    }
}
