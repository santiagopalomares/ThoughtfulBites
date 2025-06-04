import { useJsApiLoader } from "@react-google-maps/api";

export function useGoogleMapsLoader() {
  // Pull the key from process.env just once, here in a .js file:
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  
  return useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    version: "weekly",
  });
}
