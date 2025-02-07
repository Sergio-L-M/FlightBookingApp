// FlightCard.tsx
import axios from "axios";
import { Box, Paper, Typography, ThemeProvider } from "@mui/material";
import StopsList from "./StopsList";
import { useFlight } from "./flightContext";
import { FlightItemCardData } from "../PropsFlight";
import { formatFlightSchedule } from "../../utils/FormatDateeTime";
import { appleTheme } from "../themes";
import mockData from "../../mocks/itineraryMock.json";
//import AirportNameCode from "./AirportNameCode";
import { developmentCard } from "../../globalConstants";
import { useSearch } from "../flightSearch/searchContext";
import { formatNumberWithCommas } from "../FormatCurrency";
const FlightCard = ({ generalData, id}: FlightItemCardData) => {
  const { setLoading, openModal, setSelectedFlight } = useFlight();
  const {selectedKey} = useSearch();
  const handleFlightClick =async  () => {
    

    let apiUrl ;
    setSelectedFlight(mockData);
    if (developmentCard) {
      console.log("🛠️ Modo Testing: Usando datos mock.");
      setLoading(true);
      setSelectedFlight(mockData);
      setLoading(false);
    } else {
      try {
        apiUrl = `http://localhost:8080/api/flights/${selectedKey}/${id}`;
        console.log("🔍 Buscando vuelos en:", apiUrl);
        setLoading(true);
        const response = await axios.get(apiUrl);
        setSelectedFlight(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    }

    openModal();
    

    console.log("Vuelo seleccionado guardado en el contexto global");
  };

  return (

    <ThemeProvider theme={appleTheme}>
      <Paper
      
        onClick={handleFlightClick}
        data-testid="flight-card" 
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
          <Typography variant="body1" color="text.primary" data-testid="flight-schedule">
          <strong>{formatFlightSchedule(generalData.flightSchedule)}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary" data-testid="flight-route">
            <strong>{generalData.departureAirportName}{" "}({generalData.departureAirportCode})</strong> →{" "}
            <strong>{generalData.arrivalAirportName}{" "}({generalData.arrivalAirportCode}) </strong>
          </Typography>
          <Typography variant="body2" data-testid="flight-airline"><p>Airline: {generalData.airline}</p> Operating Airline: {generalData.operatingAirline}</Typography>
        </Box>
        {/* Bloque Central */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* Si quieres mostrar la duración, agrégala aquí */}
      
          <Box>
            <StopsList itineraries={generalData.stops} id={id} totalDuration={generalData.totalDuration} />
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}  data-testid="flight-total-price">
            {formatNumberWithCommas(generalData.totalPrice)}{" "}{generalData.currency}
          </Typography>
          <Typography variant="body2">Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }} data-testid="flight-price-per-traveler">
            {formatNumberWithCommas(generalData.PricePerTraveler)}{" "}{generalData.currency}
          </Typography>
          <Typography variant="body2">Per Traveler</Typography>
        </Box>
      </Paper>
    </ThemeProvider>

  );
};

export default FlightCard;
