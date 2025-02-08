
import { Box, Typography, Paper, Divider } from "@mui/material";
import { useFlight } from "../flightCard/flightContext";
import { formatNumberWithCommas } from "../FormatCurrency";
export const PriceDetails = () => {
  
  const { selectedFlight } = useFlight();
  const priceDetailsData = selectedFlight?.pricing;
  if (!priceDetailsData) {
    return null;
  }

  const { total, fees, travelerPrices, grandTotal, currency, base } = priceDetailsData;

  return (
    <Paper sx={{ p: 2 }} data-testid="price-details">
      {/* Título */}
      <Typography variant="h6" gutterBottom component="div" data-testid="price-title">
        Price Details
      </Typography>

      {/* Sección de precios generales */}
      <Box sx={{ mb: 2 }} data-testid="general-prices">
        <Typography variant="body1" component="div" data-testid="price-total">
          <strong>Total:</strong> {formatNumberWithCommas(total)} {currency}
        </Typography>
        <Typography variant="body1" component="div" data-testid="price-base">
          <strong>Base:</strong> {formatNumberWithCommas(base)} {currency}
        </Typography>
        <Typography variant="body1" component="div" data-testid="price-grand-total">
          <strong>Grand Total:</strong> {formatNumberWithCommas(grandTotal)} {currency}
        </Typography>
      </Box>

      {/* Separador */}
      <Divider sx={{ my: 2 }}  data-testid="fees-divider" />

      {/* Sección de fees */}
      <Box sx={{ mb: 2 }}data-testid="traveler-prices-section">
        <Typography variant="body1" fontWeight="bold" component="div" data-testid="fees-title">
          Fees:
        </Typography>
        {fees.map((fee, index) => (
          <Box key={index} sx={{ ml: 2 }} data-testid={`fee-item-${index}`}>
            <Typography variant="body2" component="div" data-testid={`fee-type-${index}`}>
              {fee.type}: {formatNumberWithCommas(fee.amount)} {currency}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} data-testid="price-divider"/>

      {/* Sección de precios por viajero */}
      <Box >
        <Typography variant="body1" fontWeight="bold" gutterBottom component="div" data-testid="traveler-prices-title">
          Traveler Prices:
        </Typography>

        {travelerPrices.map((traveler, index) => (
          <Box key={index} sx={{ mb: 2, ml: 2 }} data-testid={`traveler-item-${index}`}>
            <Typography variant="body2" component="div"  data-testid={`traveler-id-${index}`}>
              <strong>ID:</strong> {traveler.travelerId} — {traveler.travelerType}
            </Typography>
            <Typography variant="body2" component="div" data-testid={`traveler-fare-option-${index}`}>
              <strong>Fare Option:</strong> {traveler.fareOption}
            </Typography>
            <Typography variant="body2" component="div"  data-testid={`traveler-base-price-${index}`}>
              <strong>Base:</strong> {formatNumberWithCommas(traveler.price.base)} {traveler.price.currency}
            </Typography>
            <Typography variant="body2" component="div" data-testid={`traveler-total-price-${index}`}>
              <strong>Total:</strong> {formatNumberWithCommas(traveler.price.total)} {traveler.price.currency}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
