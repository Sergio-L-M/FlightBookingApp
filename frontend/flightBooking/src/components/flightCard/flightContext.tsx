import React, { createContext, useContext, useState, ReactNode } from "react";
import {FlightData} from "../PropsFlight";



interface FlightContextType {
  selectedFlight: FlightData | null;
  setSelectedFlight: (flight: FlightData) => void;
  isModalOpen: boolean; // Estado del modal
  openModal: () => void; // Función para abrir el modal
  closeModal: () => void; // Función para cerrar el modal
}

// Crear el contexto
const FlightContext = createContext<FlightContextType | undefined>(undefined);

// Proveedor del contexto
export const FlightProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {setIsModalOpen(true)};
  const closeModal = () => {setIsModalOpen(false)};

  return (
    <FlightContext.Provider
      value={{
        selectedFlight,
        setSelectedFlight,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error("useFlight debe usarse dentro de un FlightProvider");
  }
  return context;
};
