interface Props {
  airportName: string;
  airportCode: string;
}
const AirportNameCode = ({ airportName, airportCode }: Props) => {
  return (
    <div>
      {airportName} ({airportCode})
    </div>
  );
};
export default AirportNameCode;
