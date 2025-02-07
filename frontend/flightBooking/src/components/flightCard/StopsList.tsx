import AirportNameCode from "./AirportNameCode";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Stop } from "../PropsFlight";
import { Typography } from "@mui/material";
interface Props {
  itineraries: Stop[];
  id: string;
  totalDuration: string;
}

const StopsList = ({ itineraries, id, totalDuration }: Props) => {
  return (
    <List>
      {/* Duración total en la parte superior */}
      <ListItem>
        <Typography variant="body1" color="text.secondary">
          <strong>{totalDuration}{itineraries.length - 1 === 0 ? " (No stops)" : ` (${itineraries.length - 1} stops)`}</strong>
        </Typography>
      </ListItem>

      {/* Lista de escalas */}
      {itineraries.slice(0, -1).map((itinerary, index) => (
      <ListItem key={`${id}-${index}`}>
        <span style={{ marginRight: "10px" }}>
          <Typography variant="body1" color="text.secondary">
            <strong>{itinerary.layoverTime}</strong>
          </Typography>
        </span>
        <AirportNameCode
          airportCode={itinerary.arrivalAirportCode}
          airportName={itinerary.arrivalAirportName}
        />
      </ListItem>
    ))}

    </List>
  );
};

export default StopsList;
