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
import { useState } from "react";
interface Props {
    oneWay: boolean;
    returnOrDeparture:  boolean;
    stateHandler: ()=> void;
    sortByHandler:(sortBy: string) => void;
    updateHandler: () => Promise<void>;
  }
const FlightSort = ({returnOrDeparture, stateHandler, oneWay, sortByHandler, updateHandler}: Props) => {
  const [sort, setSort] = useState("");

  const handleChange = async (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
    sortByHandler(sort);
    await updateHandler();
  };
  return (
    <Paper >
      <FormControl sx={{width:"150px"}}>
        <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="price-true">Cheapest Flight</MenuItem>
          <MenuItem value="price-false">Most Expensive Flight</MenuItem>

          {/* 📌 Opciones de ordenamiento por duración */}
          <MenuItem value="duration-true">Shortest Duration</MenuItem>
          <MenuItem value="duration-false">Longest Duration</MenuItem>
        </Select>
      </FormControl>
      {oneWay ? "":       <Button  startIcon={ returnOrDeparture ?  <ArrowBackIosIcon/>:<ArrowForwardIosIcon />} variant="text" onClick={stateHandler} sx={{color:"white", marginTop:"10px",  float:"right", width:"20%"} }>
        {returnOrDeparture ? "Departure Flights": "Return Flights"  }
      </Button>}

    </Paper>
  );
};
export default FlightSort;
