// src/pages/SearchPage.tsx
import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import FlightSearch from '../components/flightSearch/flightSearch';
import FlightDetails from '../components/flightDetails/flightDetails';
import FlightCard from '../components/flightCard/FlightCard';
import { FlightProvider } from '../components/flightCard/flightContext';
import { FlightItemCardData } from '../components/PropsFlight';

interface Props{
    initialDepartureFlights: FlightItemCardData[];
}
const SearchPage = ({initialDepartureFlights= []}: Props) => {
  const [departureFlights, setDepartureFlights] = useState<FlightItemCardData[]>(initialDepartureFlights);
  const [searchingFlights, setSearchingFlights] = useState(false);

  return (
    <Box sx={{ backgroundColor: 'rgb(242, 242, 247)', minHeight: '100vh' }}>
      {/* Barra de búsqueda sticky con animación */}
      <Box
        component={motion.div}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'rgba(242, 242, 247, 0.8)',
          padding: 2,
          boxShadow: 'none',
          borderBottom: 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <Container>
          <FlightSearch
            handleSearchingFlights={setSearchingFlights}
            setFlights={setDepartureFlights}
          />
        </Container>
      </Box>

      {/* Cargando... si searchingFlights está activo */}
      {searchingFlights ? (
        <Box sx={{ textAlign: 'center', padding: 4 }}>Cargando...</Box>
      ) : (
        <div>
          {/* Animación de las tarjetas de vuelos */}
          <Box
            component={motion.div}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            sx={{
              overflowY: 'auto',
              height: 500,
              pt: 2,
              pb: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            {departureFlights.map((flight) => (
              <Box key={flight.id} sx={{ width: '80%' }}>
                <FlightCard {...flight} />
              </Box>
            ))}
            <FlightDetails />
          </Box>
          
        </div>
      )}
    </Box>
  );
};

export default SearchPage;
