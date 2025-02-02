import { Chip } from "@mui/material";

interface Props {
  airportName: string;
  airportCode: string;
}
const AirportNameCode = ({ airportName, airportCode }: Props) => {
  return (
    
    <> 
      {airportName} <Chip label={airportCode}></Chip>
    </>
  );
};
export default AirportNameCode;
