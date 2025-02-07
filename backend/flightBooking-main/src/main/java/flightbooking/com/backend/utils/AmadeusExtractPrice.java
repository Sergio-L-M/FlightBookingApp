package flightbooking.com.backend.utils;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;

@Service
public class AmadeusExtractPrice {

    public Map<String, Object> get(JsonNode flight) {
        Map<String, Object> result = new HashMap<>();
        JsonNode priceNode = flight.get("price");
        boolean flag = true;
        result.put("currency", priceNode.get("currency").asText());
        result.put("base", priceNode.get("base").asText());
        result.put("total", priceNode.get("total").asText());
        result.put("grandTotal", priceNode.get("grandTotal").asText());

        List<Map<String, Object>> fees = new ArrayList<>();
        for (JsonNode feeNode : priceNode.get("fees")) {
            Map<String, Object> fee = new HashMap<>();
            fee.put("amount", feeNode.get("amount").asText());
            fee.put("type", feeNode.get("type").asText());
            fees.add(fee);
        }
        result.put("fees", fees);
        
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
            if(flag){
                result.put("pricePerTraveler",  travelerPriceNode.get("total").asText());
                flag =false;
            }
            travelerInfo.put("price", travelerPrice);
            travelerPrices.add(travelerInfo);
        }

        result.put("travelerPrices", travelerPrices);

        return result;
    }
}
