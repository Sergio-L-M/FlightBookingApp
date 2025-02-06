// src/pages/LandingPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FlightSearch from '../components/flightSearch/flightSearch';

interface LandingPageProps {
  onSearch: (state:boolean) => void;
  setDepartureFlights:(flights: any[]) => void;
  isTransitioning: boolean; // // Función que nos llega desde App para cambiar de página
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch, isTransitioning, setDepartureFlights }) => {
  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url("../../public/bg2.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Capa negra con opacidad */}
      <Box
        component={motion.div}
        initial={{ opacity: 1 }}
        animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
      />

      {/* Contenido principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        {/* Título con animación */}
        <Typography
          component={motion.h1}
          variant="h2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          sx={{ mb: 4 }}
        >
          What's your next adventure?
        </Typography>

        {/* Search Box con animación */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: isTransitioning ? -150 : 0 }}
          transition={{ duration: 1 }}
          sx={{ width: '80%'}}
        >
          <FlightSearch
            // Aquí asumimos que FlightSearch tiene su propio botón
            // y llama a esta función cuando el usuario finaliza la búsqueda
            handleSearchingFlights={onSearch}
            setFlights={setDepartureFlights}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
