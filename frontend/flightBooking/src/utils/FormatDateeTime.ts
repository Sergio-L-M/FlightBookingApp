export const formatDateTime = (isoString: string | undefined) => {
    if (!isoString) return "Fecha no disponible";
  
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Formato de fecha inválido";
  
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Muestra AM/PM
    }).format(date).replace(",", ""); // Elimina la coma
  };
  
  export const formatFlightSchedule = (schedule: string | undefined) => {
    if (!schedule) return "Horario no disponible";
  
    const parts = schedule.split(" → ");
    if (parts.length !== 2) return "Formato de horario inválido";
  
    const [departure, arrival] = parts.map(date => formatDateTime(date));
  
    return `${departure} → ${arrival}`;
  };
export const formatDuration = (isoDuration: string) => {
    if (!isoDuration.startsWith("PT")) return "Formato inválido";
  
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minutesMatch = isoDuration.match(/(\d+)M/);
  
    const hours = hoursMatch ? `${hoursMatch[1]}h` : "";
    const minutes = minutesMatch ? `${minutesMatch[1]}m` : "";
  
    return `${hours} ${minutes}`.trim();
  };  