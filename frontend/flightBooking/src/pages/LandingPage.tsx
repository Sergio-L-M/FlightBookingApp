import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FlightSearch from '../components/flightSearch/flightSearch';
import { useSearch} from '../components/flightSearch/searchContext';
interface LandingPageProps {
  onSearch: (state: boolean) => void;
  isTransitioning: boolean;
}
const LandingPage: React.FC<LandingPageProps> = ({ onSearch, isTransitioning }) => {
  const {
    setLoading,
    handleSearchingFlights,
    handleSearch, // Obtén `handleSearch` desde el contexto
  } = useSearch();

  const SearchFlights = async () => {
    setLoading(true);
    handleSearchingFlights(true);
    
    // Llamar a la función `handleSearch` del contexto
    await handleSearch();

    onSearch(true);
    setTimeout(() => {
      setLoading(false);
      handleSearchingFlights(false);
    }, 1000);
  };

  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url("https://wallpapersmug.com/download/3840x2400/2e0a0c/clouds-and-sunset-sea-of-clouds.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box component={motion.div} initial={{ opacity: 1 }} animate={{ opacity: isTransitioning ? 0.5 : 1 }} transition={{ duration: 1 }} sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#fff', textAlign: 'center' }}>
        <Typography component={motion.h1} variant="h2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} sx={{ mb: 4 }}>
          What's your next adventure?
        </Typography>
        <Box component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: isTransitioning ? -150 : 0 }} transition={{ duration: 1 }} sx={{ width: '80%'}}>
          <FlightSearch
            handleSearch={SearchFlights}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
