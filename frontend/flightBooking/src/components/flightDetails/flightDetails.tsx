import { createTheme, rgbToHex, ThemeProvider } from "@mui/material/styles";
import { Dialog, DialogTitle, DialogContent, Box, Typography } from "@mui/material";
import { useFlight } from "../flightCard/flightContext";
import ItineraryCard from "./itineraryCard";
import { appleTheme } from "../themes";
// 🎨 Definimos el tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#f9f9fc",
    },
    text: {
      primary: "#333",
      secondary: "#666",
    },
  },
  typography: {
    h6: {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.9rem",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          padding: 16,
         
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
        },
      },
    },
  },
});

const FlightDetails = () => {
  const { selectedFlight, isModalOpen, closeModal } = useFlight();

  if (!selectedFlight?.generalData || !selectedFlight?.itineraries) {
    return <Typography sx={{ padding: 2, color: "#555" }}>No hay ningún vuelo seleccionado</Typography>;
  }

  return (
    <ThemeProvider theme={appleTheme}>
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md" sx ={{ backgroundColor:'rgba(0,0,30,0.4)', backdropFilter: "blur(3px)", transition: "width 1s"}}   PaperProps={{
    style: {
      backgroundColor:  "rgb(242, 242, 247)" ,
      boxShadow: 'none',
    },
  }}>
        <DialogTitle sx={{color: "black", fontWeight: "bold", background: "rgb(242, 242, 247)", padding: 5 }}>
          Flight Details
        </DialogTitle>
        <DialogContent >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {selectedFlight.itineraries.map((itinerary, index) => (
              <ItineraryCard key={index} itinerary={itinerary} />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default FlightDetails;
