import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
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
import SearchIcon from "@mui/icons-material/Search"; // 🔍 Ícono de búsqueda
import FlightSort from "../flightSort/flightSort";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { appleTheme } from "../themes";
import flightsMock from "../../mocks/validMockData.json";
const development = true;
interface Props {
  setFlights: (flights: any[]) => void;
  handleSearchingFlights: (state: boolean) => void;
}

const FlightSearch = ({ setFlights, handleSearchingFlights }: Props) => {
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs());
  const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(
    dayjs().add(3, "day")
  );
  const [currency, setCurrency] = useState("MXN");
  const [adults, setAdults] = useState(1);
  const [oneWay, setOneWay] = useState(true);
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [returnFlight, setReturnFlight] = useState(false);
  const [sortBy, setSortBy] = useState<null | string>(null); // 🔹 Inicializado como null

  const handleCurrencyChange = (event: any) => {
    setCurrency(event.target.value);
  };

  const handleAdultsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdults(parseInt(event.target.value, 10) || 1);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError("Por favor, selecciona origen y destino.");
      return;
    }

    if (!departureDate) {
      setError("Debes seleccionar una fecha de salida.");
      return;
    }

    if (!oneWay && (!arrivalDate || arrivalDate.isBefore(departureDate))) {
      setError("La fecha de regreso debe ser posterior a la de salida.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let apiUrl = `http://localhost:8080/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate.format(
        "YYYY-MM-DD"
      )}&currency=${currency}&adults=${adults}&nonStop=false`;

      if (!oneWay && returnFlight) {
        apiUrl = `http://localhost:8080/api/flights?origin=${destination}&destination=${origin}&departureDate=${arrivalDate?.format(
          "YYYY-MM-DD"
        )}&currency=${currency}&adults=${adults}&nonStop=false`;
      }

      if (sortBy !== null) {
        const sort = sortBy.split("-");
        apiUrl += `&sortBy=${sort[0]}&ascending=${sort[1]}`;
      }

      if (development) {
        console.log("🛠️ Modo Testing: Usando datos mock.");
        handleSearchingFlights(true);
        console.log("true")
        console.log(flightsMock);
        setFlights(flightsMock);
        handleSearchingFlights(false);
      } else {
        try {
          console.log("🔍 Buscando vuelos en:", apiUrl);
          handleSearchingFlights(true);
          const response = await axios.get(apiUrl);
          setFlights(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching flights:", error);
          setError("❌ Error al obtener vuelos. Intenta de nuevo.");
        } finally {
          handleSearchingFlights(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReturnState = async () => {
    setReturnFlight(!returnFlight);
    await handleSearch();
    console.log(returnFlight);
  };

  return (
    <ThemeProvider theme={appleTheme}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Notificación de error */}
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>

        {/* 📌 Contenedor principal */}
        <Paper>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)", // 📌 2 por fila en pantallas medianas
                md: "repeat(8, 1fr)", // 📌 Todos en fila horizontal si hay espacio
              },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* 📌 Fila 1: Tipo de viaje y aeropuertos */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={oneWay}
                  onChange={() => setOneWay(!oneWay)}
                  sx={{
                    color: "rgba(72, 72, 74, 1)", // Color por defecto
                    "&.Mui-checked": {
                      color: "rgba(72, 72, 74, 1)", // Color cuando está seleccionado
                    },
                  }}
                />
              }
              label="One-way"
            />
            <AirportSelector
              textLabel="Choose a departure Airport"
              onChange={(code) => setOrigin(code)}
            />
            <AirportSelector
              textLabel="Choose an arrival Airport"
              onChange={(code) => setDestination(code)}
            />

            {/* 📌 Fila 2: Fechas */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Set a departure date"
                value={departureDate}
                onChange={setDepartureDate}
              />
              {!oneWay && (
                <DatePicker
                  label="Set a return date"
                  value={arrivalDate}
                  onChange={setArrivalDate}
                />
              )}
            </LocalizationProvider>

            {/* 📌 Fila 3: Moneda y cantidad de adultos */}
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select value={currency} onChange={handleCurrencyChange}>
                <MenuItem value="MXN">MXN</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Adults"
              variant="outlined"
              type="number"
              value={adults}
              onChange={handleAdultsChange}
            />

            {/* 📌 Botón de búsqueda con lupa */}
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ height: "56px", fontWeight: "bold", borderRadius: "8px" }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </Paper>

        <FlightSort
          returnOrDeparture={returnFlight}
          oneWay={oneWay}
          stateHandler={handleReturnState}
          sortByHandler={setSortBy}
          updateHandler={handleSearch}
        ></FlightSort>
      </Box>
    </ThemeProvider>
  );
};

export default FlightSearch;
