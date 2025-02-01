import AirportNameCode from "./AirportNameCode";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Itinerary } from "../PropsFlight";
interface Props{
  itineraries:Itinerary[]
  id:string
}
const StopsList = ({ itineraries, id }: Props) => {
  return (
    <List>
      {itineraries.map((Itinerary) => (
        <ListItem key={`${id}-${Itinerary.departureAirport}`}>
          {Itinerary.duration}{" "}
          <AirportNameCode
            airportCode={Itinerary.departureAirport}
            airportName={Itinerary.departureAirport}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default StopsList;
