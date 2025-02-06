import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { useFlight } from "../flightCard/flightContext";

export const PriceDetails = () => {
  const { selectedFlight } = useFlight();
  const priceDetailsData = selectedFlight?.pricing;

  // Si no hay información de precios, no renderizamos nada
  if (!priceDetailsData) {
    return null;
  }

  const { total, fees, travelerPrices, pricePerTraveler, grandTotal, currency, base } = priceDetailsData;

  return (
    <Paper sx={{ p: 2 }}>
      {/* Título */}
      <Typography variant="h6" gutterBottom component="div">
        Price Details
      </Typography>

      {/* Sección de precios generales */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" component="div">
          <strong>Total:</strong> {total} {currency}
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Base:</strong> {base} {currency}
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Grand Total:</strong> {grandTotal} {currency}
        </Typography>
      </Box>

      {/* Separador */}
      <Divider sx={{ my: 2 }} />

      {/* Sección de fees */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" fontWeight="bold" component="div">
          Fees:
        </Typography>
        {fees.map((fee, index) => (
          <Box key={index} sx={{ ml: 2 }}>
            <Typography variant="body2" component="div">
              {fee.type}: {fee.amount} {currency}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección de precios por viajero */}
      <Box>
        <Typography variant="body1" fontWeight="bold" gutterBottom component="div">
          Traveler Prices:
        </Typography>

        {travelerPrices.map((traveler, index) => (
          <Box key={index} sx={{ mb: 2, ml: 2 }}>
            <Typography variant="body2" component="div">
              <strong>ID:</strong> {traveler.travelerId} — {traveler.travelerType}
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Fare Option:</strong> {traveler.fareOption}
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Base:</strong> {traveler.price.base} {traveler.price.currency}
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Total:</strong> {traveler.price.total} {traveler.price.currency}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
