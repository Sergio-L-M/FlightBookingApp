package flightbooking.com.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import flightbooking.com.backend.services.AmadeusAirportService;
import flightbooking.com.backend.services.AmadeusFlightService;
import flightbooking.com.backend.utils.AmadeusExtractGeneralData;
import flightbooking.com.backend.utils.AmadeusExtractItineraries;
import flightbooking.com.backend.utils.AmadeusExtractPrice;
import flightbooking.com.backend.utils.SortFligths;
import org.springframework.context.ApplicationContext;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class GenerateValidMockData {

    public static void main(String[] args) {
        try {
            // ✅ Crear instancia del ObjectMapper para manejar JSON
            ObjectMapper objectMapper = new ObjectMapper();

            // ✅ Cargar el archivo mockData.json
            File mockFile = new File("src/test/resources/mockData.json");
            JsonNode mockRawData = objectMapper.readTree(mockFile);

            // ✅ Convertir el JSON a String para simular una respuesta de la API de Amadeus
            String mockJsonString = objectMapper.writeValueAsString(mockRawData);

            // ✅ Crear instancias de los servicios necesarios
            ApplicationContext context = new AnnotationConfigApplicationContext("flightbooking.com.backend");
            AmadeusExtractGeneralData generalDataService = context.getBean(AmadeusExtractGeneralData.class);
            
            AmadeusExtractItineraries itinerariesService = new AmadeusExtractItineraries();
            AmadeusExtractPrice priceService = new AmadeusExtractPrice();
            AmadeusAirportService amadeusAirportService = context.getBean(AmadeusAirportService.class);
            SortFligths sortFlights = new SortFligths();

            // ✅ Inicializar AmadeusFlightService con los servicios mockeados
            AmadeusFlightService amadeusFlightService = new AmadeusFlightService(
                    null, generalDataService, itinerariesService, sortFlights, priceService,amadeusAirportService
            );

            // ✅ Ejecutar transformResponse() con los datos mockeados
            Map<String, Map<String, Object>>  transformedData = amadeusFlightService.transformResponse(mockJsonString);

            // ✅ Guardar el resultado en validMockData.json
            File outputFile = new File("src/test/resources/validMockData.json");
            objectMapper.writeValue(outputFile, transformedData);

            // ✅ Print en consola para confirmación
            System.out.println("✔ Archivo validMockData.json generado correctamente.");
            System.out.println(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(transformedData));

        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("❌ Error al generar validMockData.json");
        }
    }
}
