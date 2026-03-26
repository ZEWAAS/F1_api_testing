import axios from 'axios';

// Wir nutzen jetzt den Vite-Proxy für lokale Anfragen, um den CORS-Fehler zu umgehen!
const API_BASE_URL = '/api';

export const f1Api = axios.create({
  baseURL: API_BASE_URL,
});

// Holt die Daten der aktuellsten Session
export const getLatestSession = async () => {
  const response = await f1Api.get('/sessions?session_key=latest');
  return response.data[0];
};

// Holt alle Fahrer einer Sitzung
export const getDrivers = async (sessionKey: string | number) => {
  const response = await f1Api.get(`/drivers?session_key=${sessionKey}`);
  return response.data;
};

// Holt das Streckenlayout, aber NUR die ersten 10 Minuten der Session!
export const getTrackLayout = async (sessionKey: string | number, sessionStart: string) => {
  const startTime = new Date(sessionStart);
  const endTime = new Date(startTime.getTime() + 10 * 60000); // Auf 10 Minuten reduziert
  const endString = endTime.toISOString();
  
  const response = await f1Api.get(`/location?session_key=${sessionKey}&driver_number=1&date<${endString}`);
  return response.data;
};

// Holt einen "Snapshot" der Positionen für ein winziges 1-Minuten-Fenster
export const getSnapshotLocations = async (sessionKey: string | number, snapshotTime: string) => {
  const startTime = new Date(snapshotTime);
  const endTime = new Date(startTime.getTime() + 1 * 60000); // Nur 1 Minute Daten!
  const startString = startTime.toISOString();
  const endString = endTime.toISOString();

  const response = await f1Api.get(`/location?session_key=${sessionKey}&date>=${startString}&date<${endString}`);
  return response.data;
};