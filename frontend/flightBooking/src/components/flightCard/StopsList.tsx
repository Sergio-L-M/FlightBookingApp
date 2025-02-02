import AirportNameCode from "./AirportNameCode";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Itinerary } from "../PropsFlight";
import { Typography } from "@mui/material";

interface Props {
  itineraries: Itinerary[];
  id: string;
  totalDuration: string;
}

const StopsList = ({ itineraries, id, totalDuration }: Props) => {
  return (
    <List>
      {/* 📌 Duración total en la parte superior */}
      <ListItem>
        <Typography variant="body1" color="text.secondary">
          <strong>{totalDuration}</strong>
        </Typography>
      </ListItem>

      {/* 📌 Lista de escalas */}
      {itineraries.map((itinerary, index) => (
        <ListItem key={`${id}-${index}`}>
          <span style={{ marginRight: "10px" }}>{itinerary.duration}</span>
          <AirportNameCode
            airportCode={itinerary.departureAirport}
            airportName={itinerary.departureAirport}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default StopsList;
