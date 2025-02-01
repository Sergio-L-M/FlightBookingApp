import { Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, Paper } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Itinerary } from "../PropsFlight";
import AmenitiesDetails from "./amenitiesDetails";

interface ItineraryProps {
  itinerary: Itinerary;
}

const ItineraryCard = ({ itinerary }: ItineraryProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems :"center"}}>
      {/* Horario y Aeropuertos */}
      
      <Paper sx={{ display: "flex", justifyContent: "space-between", padding:4, width:"80%"  }}>
   
        <Box>
          <Typography variant="body1">{itinerary.departureTime}</Typography>
          <Typography variant="h6">{itinerary.departureAirport}</Typography>
        </Box>
        <Box>
          <Typography variant="body1">{itinerary.arrivalTime}</Typography>
          <Typography variant="h6">{itinerary.arrivalAirport}</Typography>
        </Box>
        
      </Paper>
      

  

      {/* Datos del vuelo */}
      <Paper sx={{ display: "flex", flexDirection: "column", gap: 1,  padding: 4, width:"80%" }}>
        <Typography variant="body2">
          <strong>Flight Number:</strong> {itinerary.flightNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Airline:</strong> {itinerary.airline}
        </Typography>
        <Typography variant="body2">
          <strong>Class:</strong> {itinerary.class}
        </Typography>
        <Typography variant="body2">
          <strong>Operating Airline:</strong> {itinerary.operatingAirline}
        </Typography>
        <Typography variant="body2">
          <strong>Duration:</strong> {itinerary.duration}
        </Typography>
        {itinerary.layoverTime && (
          <Typography variant="body2">
            <strong>Lay Over Time:</strong> {itinerary.layoverTime}
          </Typography>
        )}
      </Paper>



      {/* Amenidades */}
      <Accordion
  sx={{
    width: "80%",
    p: 4,
    borderRadius: 1, // 🔹 Esquinas redondeadas
    borderTop: "none", // ❌ Elimina la línea superior
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 🔹 Sombra sutil estilo Apple
    "&:before": { display: "none" }, // ❌ Elimina la línea superior predeterminada de Material UI
  }}
>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Amenities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(itinerary.amenities).length > 0 ? (
            Object.keys(itinerary.amenities).map((type) => (
              <AmenitiesDetails key={type} type={type} amenities={itinerary.amenities[type]} />
            ))
          ) : (
            <Typography variant="body2">No amanities available</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ItineraryCard;
