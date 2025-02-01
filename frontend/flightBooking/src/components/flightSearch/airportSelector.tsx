import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

interface AirportData {
  airportCode: string;
  airportName: string;
}

interface Props {
  textLabel: string;
  onChange: (airportCode: string | null) => void;
}

const AirportSelector = ({ textLabel, onChange }: Props) => {
  const options: readonly AirportData[] = [
    { airportCode: "JFK", airportName: "John F. Kennedy International Airport" },
    { airportCode: "LAX", airportName: "Los Angeles International Airport" },
    { airportCode: "SYD", airportName: "Sydney Kingsford Smith Airport" },
    { airportCode: "BKK", airportName: "Suvarnabhumi Airport" },
  ];

  const [selectedAirport, setSelectedAirport] = useState<AirportData | null>(null);
  const [inputValue, setInputValue] = useState(""); // Maneja lo que se muestra en el input

  return (
    <Autocomplete
      key="airport-selector"
      options={options}
      autoHighlight
      value={selectedAirport}
      inputValue={inputValue}
      getOptionLabel={(option) => `${option.airportCode} - ${option.airportName}`}
      isOptionEqualToValue={(option, value) => option.airportCode === value.airportCode}
      onChange={(_, newValue) => {
        setSelectedAirport(newValue);
        setInputValue(newValue ? `${newValue.airportCode}` : "");
        onChange(newValue ? newValue.airportCode : null);
      }}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)} // Captura la escritura manual
      onClose={() => {
        if (!selectedAirport) {
          setInputValue(""); // Solo limpia si no hay aeropuerto seleccionado
        }
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props; // 📌 Extraemos `key`
        return (
          <Box key={key} component="li" {...optionProps}>
            {option.airportCode} - {option.airportName}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={textLabel}
          placeholder="Select an airport"
          variant="outlined"
        />
      )}
    />
  );
};

export default AirportSelector;

