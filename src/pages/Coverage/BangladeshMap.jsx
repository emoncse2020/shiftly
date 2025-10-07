// src/components/BangladeshMap.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue (for Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FlyTo = ({ position }) => {
  const map = useMap();
  if (position) map.flyTo(position, 10, { duration: 1.5 });
  return null;
};

const BangladeshMap = ({ serviceCenters, flyToPosition }) => {
  // Center position of Bangladesh (Dhaka)
  const position = [23.685, 90.3563];

  return (
    <div className="w-full max-w-5xl h-[700px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/* Map visuals */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Example marker at Dhaka */}
        {serviceCenters.map((center, idx) => (
          <Marker key={idx} position={[center.latitude, center.longitude]}>
            <Popup>
              <strong>{center.district}</strong> <br />{" "}
              {center.covered_area.join(", ")}
            </Popup>
          </Marker>
        ))}
        {flyToPosition && <FlyTo position={flyToPosition} />}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
