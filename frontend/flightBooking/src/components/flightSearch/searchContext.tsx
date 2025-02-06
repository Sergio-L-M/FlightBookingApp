import React, { useState, createContext, useContext, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { FlightItemCardData } from "../PropsFlight";

interface SearchContextType {
  setSortBy: (input: string | null) => void;
  sortBy: string | null;
  setCurrentPage: (input: number) => void;
  currentPage: number;
  setOrigin: (input: string | null) => void;
  origin: string | null;
  setDestination: (input: string | null) => void;
  destination: string | null;
  setArrivalDate: (input: Dayjs | null) => void;
  arrivalDate: Dayjs | null;
  setDepartureDate: (input: Dayjs | null) => void;
  departureDate: Dayjs | null;
  setCurrency: (input: string) => void;
  currency: string;
  setAdults: (input: number) => void;
  adults: number;
  setOneWay: (input: boolean) => void;
  oneWay: boolean;
  handleSearchingFlights: (input: boolean) => void;
  setDepartureFlights: (input: FlightItemCardData[]) => void;
  departureFlights: FlightItemCardData[];
  setLoading: (input: boolean) => void;
  setError: (input: string | null) => void;
  loading: boolean;
  handleSearch: () => Promise<void>;
  setSelectedKey: (input:string) => void;
  selectedKey: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(dayjs().add(3, "day"));
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs());
  const [currency, setCurrency] = useState<string>("MXN");
  const [adults, setAdults] = useState<number>(1);
  const [oneWay, setOneWay] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [departureFlights, setDepartureFlights] = useState<FlightItemCardData[]>([]);
  
  const handleSearchingFlights = (isSearching: boolean) => {
    console.log("Searching flights:", isSearching);
  };

  const handleSearch = async () => {
    console.log("hola");
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
      let apiUrl = `http://localhost:8080/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate.format("YYYY-MM-DD")}&currency=${currency}&adults=${adults}&nonStop=false&page=${currentPage}`;
      if (!oneWay) {
        apiUrl += `&returnDate=${arrivalDate?.format("YYYY-MM-DD")}`;
      }
      if (sortBy !== null) {
        apiUrl += `&sortBy=${sortBy}`;
      }
      console.log("🔍 Buscando vuelos:", apiUrl);
      const response = await axios.get(apiUrl);
      console.log("respeusta");
      console.log(response);
      setDepartureFlights(response.data);
    } catch (error) {
      console.error("Error en handleSearch:", error);
      setError("❌ Error inesperado en la búsqueda.");
    } finally {
        setSelectedKey( `${origin}-${destination}-${departureDate.format("YYYY-MM-DD")}-${currency}-false-${adults}`)
        console.log(selectedKey);
        setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        sortBy, setSortBy,
        currentPage, setCurrentPage,
        origin, setOrigin,
        destination, setDestination,
        arrivalDate, setArrivalDate,
        departureDate, setDepartureDate,
        currency, setCurrency,
        adults, setAdults,
        oneWay, setOneWay,
        handleSearchingFlights,
        setDepartureFlights,
        departureFlights,
        loading,
        setLoading,
        setError,
        handleSearch,
        selectedKey,
        setSelectedKey
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch debe usarse dentro de un SearchProvider");
  }
  return context;
};
