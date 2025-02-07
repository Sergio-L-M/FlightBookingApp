import { ThemeProvider } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useFlight } from "../flightCard/flightContext";
import ItineraryCard from "./itineraryCard";
import { appleTheme } from "../themes";
import { PriceDetails } from "./PriceDetails";

const FlightDetails = () => {
  const { selectedFlight, isModalOpen, closeModal } = useFlight();
  if (!selectedFlight?.generalData || !selectedFlight?.itineraries) {
    return (
      <Typography sx={{ padding: 2, color: "#555" }}>
        No hay ningún vuelo seleccionado
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={appleTheme}>
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        sx={{
          backgroundColor: "rgba(0,0,30,0.4)",
          backdropFilter: "blur(3px)",
          transition: "width 1s",
        }}
        PaperProps={{
          style: {
            backgroundColor: "transparent", 
            boxShadow: "none",
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "stretch",  
              height: "65vh",        
            }}
          >
            {/* 1. Carta de Itinerarios con scroll */}
            <Paper
              sx={{
                flex: 1.25,
                display: "flex",
                flexDirection: "column",
                p: 4,
                backgroundColor: "rgb(242, 242, 247)",
                overflowY: "auto",      
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                Flight Details
              </Typography>

              {selectedFlight.itineraries.map((itinerary, index) => (
                <Box key={index} sx={{ pb: 10 }}>
                  <ItineraryCard itinerary={itinerary} />
                </Box>
              ))}
            </Paper>

            {/* 2. Carta de Detalles de Precio */}
            <Paper
              sx={{
                flex: 0.75,
                display: "flex",
                flexDirection: "column",
                p: 4,
                backgroundColor: "rgb(242, 242, 247)",
                justifyContent: "flex-start",
                alignItems: "center",
                overflowY: "auto", 
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                Pricing Details
              </Typography>
              <PriceDetails />
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default FlightDetails;
