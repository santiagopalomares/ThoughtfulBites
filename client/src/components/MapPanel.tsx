import { CSSProperties, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

// Same container style you already had:
const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

export interface MapPanelProps {
  restaurants: Array<{
    id: string;
    title: string;
    lat: number;
    lng: number;
  }>;
  defaultCenter: { lat: number; lng: number };
  zoom?: number;
}

export default function MapPanel({
  restaurants,
  defaultCenter,
  zoom = 12,
}: MapPanelProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // State to track which restaurant (if any) is “selected” for the InfoWindow
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    version: "weekly",
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;  

  console.log(
    "Loaded Maps API key:", 
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  );

  // Find the full restaurant object for the selected ID (if any)
  const selectedRestaurant = restaurants.find((r) => r.id === selectedId) || null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={zoom}
      onLoad={(map) => {
        if (restaurants.length > 1) {
          const bounds = new window.google.maps.LatLngBounds();
          restaurants.forEach(({ lat, lng }) => {
            bounds.extend({ lat, lng });
          });
          map.fitBounds(bounds);
        }
      }}
    >
      {restaurants.map((r) => (
        <Marker
          key={r.id}
          position={{ lat: r.lat, lng: r.lng }}
          title={r.title}
          onClick={() => {
            setSelectedId(r.id);
          }}
        />
      ))}

      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.lat,
            lng: selectedRestaurant.lng,
          }}
          onCloseClick={() => {
            setSelectedId(null);
          }}
        >
          <div>
            <strong>{selectedRestaurant.title}</strong>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
