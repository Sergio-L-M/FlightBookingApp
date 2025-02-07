import React, { useEffect } from 'react';
import { Box, Container, Pagination, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import FlightSearch from '../components/flightSearch/flightSearch';
import FlightDetails from '../components/flightDetails/flightDetails';
import FlightCard from '../components/flightCard/FlightCard';
import { useSearch } from '../components/flightSearch/searchContext';
import { FlightItemCardData } from '../components/PropsFlight';

const SearchPage = () => {
  const {
    departureFlights,
    setCurrentPage,
    currentPage,
    loading,
    setLoading,
    handleSearchingFlights,
    handleSearch,
    totalPages
  } = useSearch();

  // Función para buscar vuelos
  const SearchFlights = async () => {
    setLoading(true);
    handleSearchingFlights(true);
    await handleSearch();
    setTimeout(() => {
      setLoading(false);
      handleSearchingFlights(false);
    }, 1000);
  };

  // Manejador de cambio de página: solo actualiza el estado
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Llama a SearchFlights() cuando currentPage cambia
  useEffect(() => {
    SearchFlights();
  }, [currentPage]);

  return (
    <Box sx={{ backgroundColor: 'rgb(242, 242, 247)', minHeight: '100vh' }}>
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
          <FlightSearch handleSearch={SearchFlights} />
        </Container>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
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
            {departureFlights.map((flight: FlightItemCardData) => (
              <Box key={flight.id} sx={{ width: '80%' }}>
                <FlightCard {...flight} />
              </Box>
            ))}
            <FlightDetails />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pb: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>
        </div>
      )}
    </Box>
  );
};

export default SearchPage;
