import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import airportsMock from"../../mocks/airportsMock.json";
import { developmentSelector } from "../../globalConstants";


interface AirportData {
  code: string;
  name: string;
}

interface Props {
  textLabel: string;
  onChange: (airportCode: string | null) => void;
  setAirport: (state: AirportData | null) => void;
  Airport: AirportData| null;
}

const AirportSelector = ({ textLabel, onChange,setAirport, Airport }: Props) => {

  const [options, setOptions] = useState<AirportData[]>([]);
  //const [selectedAirport, setSelectedAirport] = useState<AirportData | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [fetchAllowed, setFetchAllowed] = useState(false);

  useEffect(() => {
    if (inputValue.length > 0 && fetchAllowed) {
      const fetchAirports = async () => {
        try {
          if (developmentSelector) {
            console.log("🛠️ Modo Testing: Usando datos mock de aeropuertos.");
            setOptions(airportsMock); // Usamos el JSON mock directamente
          } else {
            const response = await axios.get(
              `http://localhost:8080/api/flights/airports?keyword=${inputValue}`
            );
            setOptions(response.data);
          }
        } catch (error) {
          console.error("❌ Error fetching airports:", error);
        }
      };
  
      fetchAirports();
    }
  }, [inputValue, fetchAllowed]);
  return (
    <Autocomplete
      key="airport-selector"
      options={options}
      autoHighlight
      value={Airport}
      inputValue={inputValue}
      getOptionLabel={(option) => `${option.code} - ${option.name}`}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      onChange={(_, newValue) => {
        setAirport(newValue);
        setInputValue(newValue ? `${newValue.code}` : "");
        onChange(newValue ? newValue.code : null);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        setFetchAllowed(newInputValue.length > 0);
      }}
      onClose={() => {
        if (!Airport) {
          setInputValue("");
        }
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component="li" {...optionProps}>
            {option.code} - {option.name}
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
