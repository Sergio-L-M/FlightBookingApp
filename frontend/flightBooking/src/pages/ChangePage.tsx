// src/App.tsx
import { useState } from 'react';
import LandingPage from './LandingPage';
import SearchPage from './SearchPage';
//import { FlightProvider } from '../components/flightCard/flightContext';
//import { FlightItemCardData } from '../components/PropsFlight';
import { useSearch } from '../components/flightSearch/searchContext';

export function ChangePage() {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Callback que se invoca cuando el usuario inicia la búsqueda en la Landing
  const handleSearch = (state:boolean) => {
    setShowSearchPage(state);
    console.log(state);
    console.log(showSearchPage, isTransitioning)
    setTimeout(() => {
      setShowSearchPage(true); // Una vez completada la animación, mostrar SearchPage
      setIsTransitioning(false);
    }, 1000);

  };
  const {changeLandingPage} = useSearch();

  return (
    <>
 
      {changeLandingPage ? (
        <LandingPage onSearch={handleSearch} isTransitioning={changeLandingPage}/>
      ) : (
        <SearchPage/>
      )}
    </>
  );
}