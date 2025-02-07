import {
  FormControl,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useSearch } from "../flightSearch/searchContext";
import { useEffect } from "react";

interface Props {
  oneWay: boolean;
  returnOrDeparture: boolean;
  stateHandler: () => void;
  sortByHandler: (sortBy: string) => void;
  updateHandler: () => Promise<void>;
}

const FlightSort = ({ updateHandler }: Props) => {
  const {
    sortBy,
    setSortBy,
    oneWay,
    returnOrDeparture,
    setReturnOrDeparture
  } = useSearch();

  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
    
  };

  // Efecto para ejecutar updateHandler después de actualizar sortBy
  useEffect(() => {
    if(sortBy !== ""){
      updateHandler();
    }
    
 
  }, [sortBy]); // Se ejecuta cuando sortBy cambia

  return (
    <Paper>
      <FormControl sx={{ width: "150px" }}>
        <InputLabel id="sort-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortBy}
          label="Sort By"
          onChange={handleChange}
        >
          <MenuItem value="cheapest">Cheapest Flight</MenuItem>
          <MenuItem value="most_expensive">Most Expensive Flight</MenuItem>
          <MenuItem value="shortest">Shortest Duration</MenuItem>
          <MenuItem value="longest">Longest Duration</MenuItem>
        </Select>
      </FormControl>

      {!oneWay && (
        <Button
          startIcon={returnOrDeparture ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          variant="text"
          onClick={async () => {
            await updateHandler();
            setReturnOrDeparture(!returnOrDeparture);
          }}
          sx={{ color: "white", marginTop: "10px", float: "right", width: "20%" }}
        >
          {returnOrDeparture ? "Departure Flights" : "Return Flights"}
        </Button>
      )}
    </Paper>
  );
};

export default FlightSort;
