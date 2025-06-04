import { CSSProperties, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

export interface MapPanelProps {
  restaurants: Array<{
    id: string;
    title: string;
    address?: string;
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
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    version: "weekly",
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  const selectedRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || null;

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
            setSelectedRestaurantId(r.id);
          }}
        />
      ))}

      {/* If a restaurant is selected, open an info window */}
      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.lat,
            lng: selectedRestaurant.lng,
          }}
          onCloseClick={() => {
            setSelectedRestaurantId(null);
          }}
        >
          <div style={{ maxWidth: "220px" }}>
            <h3 style={{ margin: "0 0 4px 0" }}>
              {selectedRestaurant.title}
            </h3>

            {selectedRestaurant.address && (
              <div style={{ marginBottom: "6px", fontSize: "0.9em" }}>
                {selectedRestaurant.address}
              </div>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                selectedRestaurant.address
                  ? selectedRestaurant.address
                  : selectedRestaurant.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "6px 10px",
                background: "#4285F4",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "0.9em",
              }}
            >
              View on Google Maps
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
