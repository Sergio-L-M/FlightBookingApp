import FlightCard from "./components/flightCard/FlightCard";
import { FlightProvider } from "./components/flightCard/flightContext";
import FlightDetails from "./components/flightDetails/flightDetails";
import FlightSearch from "./components/flightSearch/flightSearch";
import { useState } from "react";
import { FlightData } from "./components/PropsFlight";
import { Box, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, FreeMode, Mousewheel } from "swiper/modules";
import "swiper/swiper-bundle.css"; // 📌 Importamos Swiper Bundle

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
          <FlightSearch handleSearchingFlights={handleSearchingFlights} setFlights={setDepartureFlights} />
        </Container>
      </Box>

      {/* 📌 Scroll Vertical de FlightCards con Swiper */}
      {searchingFlights ? (
        <Box sx={{ textAlign: "center", padding: 4 }}>Cargando...</Box>
      ) : (
        <FlightProvider>
          <Container>
            <Swiper
              direction="vertical" // 📌 Scroll en eje Y
              slidesPerView="auto" // 📌 Altura dinámica según el contenido
              spaceBetween={20} // 📌 Espacio entre tarjetas
              freeMode={true} // 📌 Permite desplazamiento sin ajuste forzado
              scrollbar={{ draggable: true }} // 📌 Scrollbar visible y arrastrable
              mousewheel={{ forceToAxis: true }} // 📌 Permite scroll con trackpad/mousewheel
              touchReleaseOnEdges={true} // 📌 Permite gestos táctiles naturales
              grabCursor={true} // 🖱️ Hace que parezca "draggeable"
              modules={[Scrollbar, FreeMode, Mousewheel]} // 📌 Módulos de Scrollbar, FreeMode y Mousewheel
              style={{
                height: "500px",
                paddingBottom: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // 📌 Centrar la primera tarjeta verticalmente
                alignItems: "center", // 📌 Centrar horizontalmente
                marginTop: "50px", // 📌 Espacio entre `FlightSearch` y la primera tarjeta
              }}
            >
              {departureFlights.map((flight, index) => (
                <SwiperSlide key={index} style={{ width: "100%" }}>
                  <FlightCard key={flight.id} {...flight} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Container>

          <FlightDetails />
        </FlightProvider>
      )}
    </Box>
  );
}

export default App;
