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
  travelerId:number 
}
export interface GeneralData {
  costPerTraveler: string;
  departureAirport: { code: string; name?: string };
  totalDuration: string;
  flightSchedule: string;
  airline: string;
  arrivalAirport: { code: string; name?: string };
  totalCost: string;
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
  price:Price; 
  travelerPrices:TravelerPrices[]
}

export interface FlightData {
  generalData: GeneralData;
  itineraries: Itinerary[];
  id: string;
  pricing:Pricing
}
