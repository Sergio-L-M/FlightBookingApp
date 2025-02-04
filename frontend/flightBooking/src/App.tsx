import FlightCard from "./components/flightCard/FlightCard";
import { FlightProvider } from "./components/flightCard/flightContext";
import FlightDetails from "./components/flightDetails/flightDetails";
import FlightSearch from "./components/flightSearch/flightSearch";
import { useState } from "react";
import { FlightData } from "./components/PropsFlight";
import { Box, Container } from "@mui/material";

function App() {
  const [departureFlights, setDepartureFlights] = useState<FlightData[]>([]);
  const [searchingFlights, setSearchingFlights] = useState(false);

  const handleSearchingFlights = (state: boolean) => {
    setSearchingFlights(state);
  };

  return (
    <Box sx={{ backgroundColor: "rgb(242, 242, 247)", minHeight: "100vh" }}>
      {/* 📌 FlightSearch fijo con efecto de difuminado */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "rgba(242, 242, 247, 0.8)", // 🔹 Transparencia para efecto blur
          padding: 2,
          boxShadow: "none",
          borderBottom: "none",
          backdropFilter: "blur(10px)", // 🎨 Difuminado
          WebkitBackdropFilter: "blur(10px)", // 🎨 Soporte en Safari
        }}
      >
        <Container>
          <FlightSearch
            handleSearchingFlights={handleSearchingFlights}
            setFlights={setDepartureFlights}
          />
        </Container>
      </Box>

      {/* 📌 Scroll Vertical de FlightCards con Swiper */}
      {searchingFlights ? (
        <Box sx={{ textAlign: "center", padding: 4 }}>Cargando...</Box>
      ) : (
        <FlightProvider>
          <Box
            sx={{
              overflowY: "auto",
              height: 500, // Ajusta la altura para controlar el scroll
              pt: 2, // Padding superior
              pb: 2, // Padding inferior
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Centra horizontalmente los elementos
              gap: 2, // Espaciado entre tarjetas
              mt: 4, // Margen superior
            }}
          >
            {departureFlights.map((flight) => (
              <Box
                key={flight.id}
                sx={{
                  width: "80%", // Controla el ancho de las tarjetas
                  // Máximo ancho para evitar que sean muy grandes
                }}
              >
                <FlightCard {...flight} />
              </Box>
            ))}
          </Box>

          <FlightDetails />
        </FlightProvider>
      )}
    </Box>
  );
}

export default App;
