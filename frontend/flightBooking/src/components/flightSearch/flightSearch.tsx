import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AirportSelector from "./airportSelector";
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  Alert,
  Snackbar,
  Paper,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FlightSort from "../flightSort/flightSort";
import { ThemeProvider } from "@mui/material/styles";
import { appleTheme } from "../themes";
import { useSearch } from "./searchContext";

const FlightSearch = ({ handleSearch }: {  handleSearch: () => Promise<void>; }) => {
  const {
    setOrigin,
    setDestination,
    setCurrency,
    setAdults,
    setOneWay,
    oneWay,
    origin,
    destination,
    currency,
    adults,
    loading,
    setArrivalDate,
    arrivalDate,
    setDepartureDate,
    departureDate
  } = useSearch();


  const [error, setError] = useState<string | null>(null);

  const [returnFlight, setReturnFlight] = useState(false);

  const handleReturnState = async () => {
    setReturnFlight(!returnFlight);
    await handleSearch();
  };
  useEffect(() => {
    console.log("Contexto actualizado:", { arrivalDate, departureDate });
}, [arrivalDate, departureDate]);

  return (
    <ThemeProvider theme={appleTheme}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", padding: 1, flexDirection: "column", alignItems: "center" }}>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Paper>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(8, 1fr)" }, gap: 2, alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox checked={oneWay} onChange={() => setOneWay(!oneWay)} />}
              label="One-way"
            />
            <AirportSelector textLabel="Choose a departure Airport" onChange={setOrigin} />
            <AirportSelector textLabel="Choose an arrival Airport" onChange={setDestination} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Arrival date" value={ arrivalDate} onChange={setArrivalDate} />
              {!oneWay && <DatePicker label="Departure date" value={departureDate} onChange={setDepartureDate} />}
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                <MenuItem value="MXN">MXN</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Adults" variant="outlined" type="number" value={adults} onChange={(event) => setAdults(Math.max(1, parseInt(event.target.value, 10) || 1))} />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} disabled={loading} sx={{ height: "56px", fontWeight: "bold", borderRadius: "8px" }}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </Paper>
        <FlightSort returnOrDeparture={returnFlight} oneWay={oneWay} stateHandler={handleReturnState} sortByHandler={() => {}} updateHandler={handleSearch} />
      </Box>
    </ThemeProvider>
  );
};

export default FlightSearch;
