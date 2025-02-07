// src/App.tsx
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import { FlightProvider } from './components/flightCard/flightContext';
//import { FlightItemCardData } from './components/PropsFlight';
import { SearchProvider } from './components/flightSearch/searchContext';

function App() {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  //const [departureFlights, setDepartureFlights] = useState<FlightItemCardData[]>([]);
  // Callback que se invoca cuando el usuario inicia la búsqueda en la Landing
  const handleSearch = (state:boolean) => {
    setShowSearchPage(state);
    console.log(state);
    setTimeout(() => {
      setShowSearchPage(true); // Una vez completada la animación, mostrar SearchPage
      setIsTransitioning(false);
    }, 1000);

  };
 

  return (
    <>
  <SearchProvider>
    <FlightProvider>
      {!showSearchPage ? (
        <LandingPage onSearch={handleSearch} isTransitioning={isTransitioning}/>
      ) : (
        <SearchPage/>
      )}
      </FlightProvider>
      </SearchProvider>
    </>
  );
}

export default App;
