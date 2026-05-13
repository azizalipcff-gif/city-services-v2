import { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}

const LocationPicker = ({ onLocationSelect, initialLat = 34.6867, initialLng = -1.9086, initialAddress = '' }: LocationPickerProps) => {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLoading(false);
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const formattedAddress = data.display_name || `${latitude}, ${longitude}`;
      setAddress(formattedAddress);
      onLocationSelect(latitude, longitude, formattedAddress);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      const fallbackAddress = `${latitude}, ${longitude}`;
      setAddress(fallbackAddress);
      onLocationSelect(latitude, longitude, fallbackAddress);
    }
  };

  const handleManualLocation = () => {
    onLocationSelect(lat, lng, address);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-[#d4af37]" />
        <h3 className="text-lg font-semibold text-white">Location</h3>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
        {/* Current Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#b8941f] text-[#071126] font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className="w-5 h-5" />
          {loading ? 'Getting Location...' : 'Use My Current Location'}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Manual Coordinates Input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              placeholder="34.6867"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37]"
              placeholder="-1.9086"
            />
          </div>
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37]"
            placeholder="Enter address or use current location"
          />
        </div>

        {/* Confirm Location Button */}
        <button
          onClick={handleManualLocation}
          className="w-full bg-[#071126] hover:bg-[#0a1a3a] border border-[#d4af37] text-[#d4af37] font-semibold py-3 px-4 rounded-xl transition-all"
        >
          Confirm Location
        </button>

        {/* Location Display */}
        {lat !== initialLat || lng !== initialLng ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Selected: {lat.toFixed(6)}, {lng.toFixed(6)}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationPicker;
