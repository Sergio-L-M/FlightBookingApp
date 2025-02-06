export interface Amenity {
  description: string;
  isChargeable: boolean;
}
export interface Price{
  total:string;
  fees:{ amount: string, type: string }[];
  grandTotal:string;
  currency:string;
  base:string;
}
export interface TravelerPrices{
  travelerType:string; 
  price:{total:string; 
  currency:string; base:string}; 
  fareOption:string; 
  travelerId:string ;
}
export interface Stop {
  layoverTime:string ; arrivalAirport:string
}
export interface GeneralData {
  PricePerTraveler: string;
  departureAirport: string;
  totalDuration: string;
  flightSchedule: string;
  airline: string;
  arrivalAirport: string;
  operatingAirline: string;
  totalPrice: string;
  stops:Stop[]
}

export interface Itinerary {
  segmentId: string;
  departureTime: string;
  departureAirport: string;
  aircraft: string;
  cabin: string;
  flightNumber: string;
  duration: string;
  layoverTime?: string;
  fareBasis: string;
  arrivalTime: string;
  airline: string;
  arrivalAirport: string;
  class: string;
  operatingAirline: string;
  amenities:  { [key: string]: Amenity[] };
}
export interface Pricing {

  total:string;
  fees:{ amount: string, type: string }[];
  travelerPrices:TravelerPrices[];
  pricePerTraveler:string;
  grandTotal:string;
  currency:string;
  base:string;
}

export interface FlightData {
  generalData: GeneralData;
  itineraries: Itinerary[];
  id: string;
  pricing:Pricing
}


export interface FlightItemCardData {
  generalData: GeneralData;
  id: string;
}
