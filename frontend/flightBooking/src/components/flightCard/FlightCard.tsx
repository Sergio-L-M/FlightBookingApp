// FlightCard.tsx

import { Box, Paper, Typography, ThemeProvider } from "@mui/material";
import StopsList from "./StopsList";
import { useFlight } from "./flightContext";
import { FlightData } from "../PropsFlight";

import { appleTheme } from "../themes";
const FlightCard = ({ generalData, itineraries, id }: FlightData) => {
  const { setSelectedFlight, selectedFlight, openModal } = useFlight();

  const handleFlightClick = () => {
    setSelectedFlight({ generalData, itineraries, id });
    openModal();
    console.log("Vuelo seleccionado guardado en el contexto global", selectedFlight);
  };

  return (

    <ThemeProvider theme={appleTheme}>
      <Paper
      
        onClick={handleFlightClick}
        sx={{
          // Ajustamos la disposición a columnas en móvil y a filas en pantallas medianas o más
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          p: 5,
          m: "auto",
          width: { xs: "90%", sm: "70%" }, // Porcentaje variable para responsividad
          cursor: "pointer",
        }}
      >
        {/* Bloque Izquierdo */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" color="text.primary">
            {generalData.flightSchedule}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>{generalData.departureAirport.name} ({generalData.departureAirport.code})</strong> →{" "}
            <strong>{generalData.arrivalAirport.name} ({generalData.arrivalAirport.code})</strong>
          </Typography>
          <Typography variant="body2">{generalData.airline}</Typography>
        </Box>
        {/* Bloque Central */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* Si quieres mostrar la duración, agrégala aquí */}
          <Box>
            {/* <Typography variant="body2"> {generalData.duration} </Typography> */}
          </Box>
          <Box>
            <StopsList itineraries={itineraries} id={id} />
          </Box>
        </Box>
        {/* Bloque Derecho (Costos) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(28, 28, 30, 0.05)",
            borderRadius: 2,
            p: 2,
            alignSelf: { xs: "stretch", md: "center" }, // Para que en móvil ocupe todo el ancho
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {generalData.totalCost}
          </Typography>
          <Typography variant="body2">Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
            {generalData.costPerTraveler}
          </Typography>
          <Typography variant="body2">Per Traveler</Typography>
        </Box>
      </Paper>
    </ThemeProvider>

  );
};

export default FlightCard;
