import { Chip, Typography } from "@mui/material";

interface Props {
  airportName: string;
  airportCode: string;
}
const AirportNameCode = ({ airportName, airportCode }: Props) => {
  return (
    
    <> 
      <Typography variant="overline" gutterBottom sx={{ display: 'block' }}>{airportName}</Typography> <Chip label={airportCode}></Chip>
    </>
  );
};
export default AirportNameCode;
