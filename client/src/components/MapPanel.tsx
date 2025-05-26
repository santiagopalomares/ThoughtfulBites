import { CSSProperties } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

const center = { lat: 33.68, lng: -117.78 }; // MOCK EXAMPLE: UCI

export default function MapPanel() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    version: "weekly",
    libraries: [],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      <Marker position={center} />
    </GoogleMap>
  );
}
