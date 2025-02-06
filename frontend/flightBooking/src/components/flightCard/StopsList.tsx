import AirportNameCode from "./AirportNameCode";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Stop } from "../PropsFlight";
import { Typography } from "@mui/material";
import { formatDuration } from "../../utils/FormatDateeTime";
interface Props {
  itineraries: Stop[];
  id: string;
  totalDuration: string;
}

const StopsList = ({ itineraries, id, totalDuration }: Props) => {
  return (
    <List>
      {/* 📌 Duración total en la parte superior */}
      <ListItem>
        <Typography variant="body1" color="text.secondary">
          <strong>{totalDuration}{itineraries.length === 0 ? " (No stops)" : ` (${itineraries.length} stops)`}</strong>
        </Typography>
      </ListItem>

      {/* 📌 Lista de escalas */}
      {itineraries.map((itinerary, index) => (
        <ListItem key={`${id}-${index}`}>
          <span style={{ marginRight: "10px" }}>
            {" "}
            <Typography variant="body1" color="text.secondary">
              <strong>{itinerary.layoverTime}</strong>
            </Typography>
          </span>
          <AirportNameCode
            airportCode={itinerary.arrivalAirport}
            airportName={itinerary.arrivalAirport}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default StopsList;
