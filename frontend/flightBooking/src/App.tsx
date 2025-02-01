import FlightCard from "./components/flightCard/FlightCard";
import { FlightProvider } from "./components/flightCard/flightContext";
import FlightDetails from "./components/flightDetails/flightDetails";
import FlightSearch from "./components/flightSearch/flightSearch";
import "./styles/styles.css";

import { useState, useEffect } from "react";
import { FlightData } from "./components/PropsFlight";
import { Box } from "@mui/material";



function App() {
  const [departureFlights, setDepartureFlights] = useState<FlightData[]>([]);
  const [searchingFlights, setSearchingFlights] = useState(false);
  const handleSearchingFlights = (state: boolean) =>{
    setSearchingFlights(state);
    console.log("Cargando", searchingFlights)
  }
  return (
    <div style={ {backgroundColor: "rgb(242, 242, 247)"}}>
      <Box sx={{ padding: 2  }}>
        <Box >
          <FlightSearch
          handleSearchingFlights={handleSearchingFlights}
            setFlights={setDepartureFlights}
          />
        </Box>

      </Box>
      {searchingFlights ? "cargando": 
      <FlightProvider>
        {departureFlights.map((flight, index) => (
          <Box sx={{ padding: 2, alignItems:"center" }} key={index}>
            <FlightCard key={flight.id} {...flight} />
          </Box>
        ))}
        <FlightDetails />
      </FlightProvider>
    }
      </div>
  );
}

export default App;
