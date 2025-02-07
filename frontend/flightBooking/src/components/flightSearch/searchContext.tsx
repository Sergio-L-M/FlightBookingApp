import React, { useState, createContext, useContext, ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { FlightItemCardData } from "../PropsFlight";

interface SearchContextType {
  setSortBy: (input: string ) => void;
  sortBy: string;
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
  setReturnOrDeparture: (input: boolean) => void;
  returnOrDeparture:boolean;
  setTotalPages: (input: number) => void;
  totalPages: number;
  setChangeLandingPage: (input: boolean) => void;
  changeLandingPage: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(dayjs());
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs());
  const [currency, setCurrency] = useState<string>("MXN");
  const [adults, setAdults] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [oneWay, setOneWay] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [departureFlights, setDepartureFlights] = useState<FlightItemCardData[]>([]);
  const [returnOrDeparture,setReturnOrDeparture] = useState<boolean>(false);
  const  [changeLandingPage, setChangeLandingPage] = useState<boolean>(false);
  
  const handleSearchingFlights = (isSearching: boolean) => {
    console.log("Searching flights:", isSearching);
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
        let apiUrl = '';
        console.log(returnOrDeparture);
        


          if (!returnOrDeparture) {
            const formattedArrival = arrivalDate ? arrivalDate.format("YYYY-MM-DD") : "";
              apiUrl = `http://localhost:8080/api/flights?origin=${origin}&destination=${destination}`+
              (formattedArrival ? `&departureDate=${formattedArrival}` : "") +
              `&currency=${currency}&adults=${adults}&nonStop=false&page=${currentPage}`;
              console.log("ida");
           
            } else {
              const formattedDepartureDate = departureDate ? departureDate.format("YYYY-MM-DD") : "";
  
              apiUrl = `http://localhost:8080/api/flights?origin=${destination}&destination=${origin}` +
                  (formattedDepartureDate ? `&departureDate=${formattedDepartureDate}` : "") +
                  `&currency=${currency}&adults=${adults}&nonStop=false&page=${currentPage}`;
                  console.log("regreso")
          }
        
        if (sortBy !== null) {
            apiUrl += `&sortBy=${sortBy}`;
        }

        console.log("🔍 Buscando vuelos:", apiUrl);
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.flights && response.data.totalPages !== undefined) {
            setDepartureFlights(response.data.flights);
            setTotalPages(Number(response.data.totalPages)); // Asegurar que totalPages sea un número
            if (!changeLandingPage){
              setChangeLandingPage(true);
            }
        }
    } catch (error) {
        console.error("Error en handleSearch:", error);
        setError("❌ Error inesperado en la búsqueda.");
    } finally {
        setSelectedKey(`${origin}-${destination}-${departureDate.format("YYYY-MM-DD")}-${currency}-false-${adults}`);
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
        setSelectedKey,
        returnOrDeparture,
        setReturnOrDeparture,
        totalPages,
        setTotalPages,
        changeLandingPage,
        setChangeLandingPage

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
