import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Itinerary } from "../PropsFlight";
import AmenitiesDetails from "./amenitiesDetails";
import { formatDateTime } from "../../utils/FormatDateeTime";

interface ItineraryProps {
  itinerary: Itinerary;
}

const ItineraryCard = ({ itinerary }: ItineraryProps) => {
  return (
    <Paper
      sx={{
        
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        height: "100%", 
      }}
      data-testid="itinerary-card"
    >
      {/*Horario y Aeropuertos */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 4, 
          width: "100%",
          p: 1,
        }}
      >
        <Box textAlign="center">
          <Typography variant="body1" data-testid="departure-time">
            {formatDateTime(itinerary.departureTime)}
          </Typography>
          <Typography variant="body1"  data-testid="departure-airport">  <strong>{itinerary.departureAirportName} {" "}({itinerary.departureAirportCode})  </strong></Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="body1" data-testid="arrival-time">
            {formatDateTime(itinerary.arrivalTime)}
          </Typography>
          <Typography variant="body1" data-testid="arrival-airport">  <strong>{itinerary.arrivalAirportName} {" "} ({itinerary.arrivalAirportCode})  </strong></Typography>
        </Box>
      </Box>

      <Divider sx={{ width: "100%" }} />

      {/* Datos del vuelo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: "100%",
          p: 2,
          mt: 1.25,
          mb: 1.25,
        }}
      >
        <Typography variant="body2"  data-testid="flight-number">
          <strong>Flight Number:</strong> {itinerary.flightNumber}
        </Typography>
        <Typography variant="body2"  data-testid="airline">
          <strong>Airline:</strong> {itinerary.airline}
        </Typography>
        <Typography variant="body2" data-testid="class">
          <strong>Class:</strong> {itinerary.class}
        </Typography>
        <Typography variant="body2" data-testid="operating-airline">
          <strong>Operating Airline:</strong> {itinerary.operatingAirline}
        </Typography>
        <Typography variant="body2" data-testid="duration">
          <strong>Duration:</strong> {itinerary.duration}
        </Typography>
        <Typography variant="body2" data-testid="cabin">
          <strong>Cabin:</strong> {itinerary.cabin}
        </Typography>
        {itinerary.layoverTime && (
          <Typography variant="body2" data-testid="layover-time">
            <strong>Layover Time:</strong> {itinerary.layoverTime}
          </Typography>
        )}
      </Box>

      <Divider sx={{ width: "100%" }} />

      {/* Amenidades con Acordeón */}
      <Accordion
        sx={{
          width: "100%",
          borderRadius: 2, 
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0)",
          "&:before": { display: "none" }, 
          p: 0.75,
        }} data-testid="amenities-accordion"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "transparent",
            minHeight: 25,
            maxHeight: 25,
          }}
        >
          <Typography variant="h6">Amenities</Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ backgroundColor: "transparent" }}  data-testid="amenities-details">
          {Object.keys(itinerary.amenities).length > 0 ? (
            Object.keys(itinerary.amenities).map((type) => (
              <AmenitiesDetails
                key={type}
                type={type}
                amenities={itinerary.amenities[type]}
              />
            ))
          ) : (
            <Typography variant="body2">No amenities available</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ItineraryCard;
