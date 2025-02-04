package flightbooking.com.backend.utils;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;

@Service
public class AmadeusExtractPrice {

    public Map<String, Object> get(JsonNode flight) {
        Map<String, Object> result = new HashMap<>();

        // 🔹 Extraer y formatear la sección "price"
        JsonNode priceNode = flight.get("price");
        Map<String, Object> price = new HashMap<>();
        price.put("currency", priceNode.get("currency").asText());
        price.put("base", priceNode.get("base").asText());
        price.put("total", priceNode.get("total").asText());
        price.put("grandTotal", priceNode.get("grandTotal").asText());

        // 🔹 Extraer y formatear la sección "fees"
        List<Map<String, Object>> fees = new ArrayList<>();
        for (JsonNode feeNode : priceNode.get("fees")) {
            Map<String, Object> fee = new HashMap<>();
            fee.put("amount", feeNode.get("amount").asText());
            fee.put("type", feeNode.get("type").asText());
            fees.add(fee);
        }
        price.put("fees", fees);
        
        // 🔹 Extraer y formatear la sección "travelerPricings"
        List<Map<String, Object>> travelerPrices = new ArrayList<>();
        for (JsonNode traveler : flight.get("travelerPricings")) {
            Map<String, Object> travelerInfo = new HashMap<>();
            travelerInfo.put("travelerId", traveler.get("travelerId").asText());
            travelerInfo.put("fareOption", traveler.get("fareOption").asText());
            travelerInfo.put("travelerType", traveler.get("travelerType").asText());

            JsonNode travelerPriceNode = traveler.get("price");
            Map<String, Object> travelerPrice = new HashMap<>();
            travelerPrice.put("currency", travelerPriceNode.get("currency").asText());
            travelerPrice.put("base", travelerPriceNode.get("base").asText());
            travelerPrice.put("total", travelerPriceNode.get("total").asText());

            travelerInfo.put("price", travelerPrice);
            travelerPrices.add(travelerInfo);
        }

        // 🔹 Agregar todo al resultado final
        result.put("price", price);
        result.put("travelerPrices", travelerPrices);

        return result;
    }
}
