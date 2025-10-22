import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const MapPicker = ({ onMapClick, pickup, dropoff, selectedLocation }) => {
    const position = [28.6139, 77.2090];

    return (
        <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents onMapClick={onMapClick} />

            {/* Display a marker for the pickup location if it's set */}
            {pickup && (
                <Marker position={[pickup.lat, pickup.lng]}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}

            {dropoff && (
                <Marker position={[dropoff.lat, dropoff.lng]}>
                    <Popup>Drop-off Location</Popup>
                </Marker>
            )}
            {selectedLocation && (
                 <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                    <Popup>Selected Location</Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MapPicker;
