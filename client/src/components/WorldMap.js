import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Country coordinates for major regions
const COUNTRY_LOCATIONS = {
  'United States': [39.8283, -98.5795],
  'United Kingdom': [55.3781, -3.4360],
  'Canada': [56.1304, -106.3468],
  'Australia': [-25.2744, 133.7751],
  'Germany': [51.1657, 10.4515],
  'France': [46.2276, 2.2137],
  'Japan': [36.2048, 138.2529],
  'Brazil': [-14.2350, -51.9253],
  'Mexico': [23.6345, -102.5528],
  'Spain': [40.4637, -3.7492],
  'Italy': [41.8719, 12.5674],
  'Netherlands': [52.1326, 5.2913],
  'Sweden': [60.1282, 18.6435],
  'Norway': [60.4720, 8.4689],
  'Denmark': [56.2639, 9.5018],
  'Finland': [61.9241, 25.7482],
  'Poland': [51.9194, 19.1451],
  'India': [20.5937, 78.9629],
  'South Korea': [35.9078, 127.7669],
  'Argentina': [-38.4161, -63.6167]
};

function MapClickHandler({ onCountrySelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // Simple geographical region detection based on coordinates
      let selectedCountry = 'United States'; // Default
      
      if (lat > 45 && lng > -10 && lng < 30) selectedCountry = 'Sweden';
      else if (lat > 40 && lat < 55 && lng > -10 && lng < 20) selectedCountry = 'Germany';
      else if (lat > 35 && lat < 50 && lng > -5 && lng < 10) selectedCountry = 'France';
      else if (lat > 35 && lat < 45 && lng > 5 && lng < 20) selectedCountry = 'Italy';
      else if (lat > 50 && lng > -10 && lng < 5) selectedCountry = 'United Kingdom';
      else if (lat > 40 && lat < 45 && lng > -10 && lng < 5) selectedCountry = 'Spain';
      else if (lat > 25 && lat < 50 && lng > -130 && lng < -60) selectedCountry = 'United States';
      else if (lat > 45 && lng > -140 && lng < -50) selectedCountry = 'Canada';
      else if (lat < -10 && lng > 110 && lng < 160) selectedCountry = 'Australia';
      else if (lat > -35 && lat < 5 && lng > -80 && lng < -30) selectedCountry = 'Brazil';
      else if (lat > 10 && lat < 35 && lng > -120 && lng < -80) selectedCountry = 'Mexico';
      else if (lat > 30 && lat < 45 && lng > 125 && lng < 145) selectedCountry = 'Japan';
      else if (lat > 30 && lat < 40 && lng > 120 && lng < 135) selectedCountry = 'South Korea';
      else if (lat > 5 && lat < 40 && lng > 65 && lng < 100) selectedCountry = 'India';
      else if (lat > -55 && lat < -20 && lng > -75 && lng < -50) selectedCountry = 'Argentina';
      else if (lat > 45 && lat < 55 && lng > 10 && lng < 25) selectedCountry = 'Poland';
      else if (lat > 50 && lat < 55 && lng > 3 && lng < 8) selectedCountry = 'Netherlands';
      else if (lat > 55 && lat < 60 && lng > 8 && lng < 12) selectedCountry = 'Denmark';
      else if (lat > 58 && lat < 62 && lng > 20 && lng < 30) selectedCountry = 'Finland';
      else if (lat > 58 && lat < 62 && lng > 5 && lng < 20) selectedCountry = 'Norway';
      
      onCountrySelect(selectedCountry);
    }
  });
  return null;
}

function WorldMap({ onCountrySelect }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Create markers for major countries
    const countryMarkers = Object.entries(COUNTRY_LOCATIONS).map(([country, coords]) => ({
      id: country,
      position: coords,
      country: country
    }));
    setMarkers(countryMarkers);
  }, []);

  const handleMarkerClick = (country) => {
    onCountrySelect(country);
  };

  return (
    <div className="world-map" style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onCountrySelect={onCountrySelect} />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker.country),
            }}
          >
            <Popup>
              <div>
                <strong>{marker.country}</strong>
                <br />
                Click to see popular music here
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default WorldMap;
