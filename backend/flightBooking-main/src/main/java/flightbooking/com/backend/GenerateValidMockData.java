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


            ObjectMapper objectMapper = new ObjectMapper();
            File mockFile = new File("src/test/resources/mockData.json");
            JsonNode mockRawData = objectMapper.readTree(mockFile);
            String mockJsonString = objectMapper.writeValueAsString(mockRawData);
            ApplicationContext context = new AnnotationConfigApplicationContext("flightbooking.com.backend");
            AmadeusExtractGeneralData generalDataService = context.getBean(AmadeusExtractGeneralData.class);
            
            AmadeusExtractItineraries itinerariesService = new AmadeusExtractItineraries();
            AmadeusExtractPrice priceService = new AmadeusExtractPrice();
            AmadeusAirportService amadeusAirportService = context.getBean(AmadeusAirportService.class);
            SortFligths sortFlights = new SortFligths();
            AmadeusFlightService amadeusFlightService = new AmadeusFlightService(
                    null, generalDataService, itinerariesService, sortFlights, priceService,amadeusAirportService
            );

            Map<String, Map<String, Object>>  transformedData = amadeusFlightService.transformResponse(mockJsonString);

            File outputFile = new File("src/test/resources/validMockData.json");
            objectMapper.writeValue(outputFile, transformedData);
            System.out.println("✔ Archivo validMockData.json generado correctamente.");
            System.out.println(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(transformedData));

        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("❌ Error al generar validMockData.json");
        }
    }
}
