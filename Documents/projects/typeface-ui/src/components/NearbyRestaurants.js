import React, { useState } from "react";
import axios from "axios";

export default function NearbyRestaurants() {
  const [locationMethod, setLocationMethod] = useState(null); // 'current' or 'custom'
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [radius, setRadius] = useState(3);

  // Step 1: Get location method
  const selectLocationMethod = (method) => {
    setLocationMethod(method);
    if (method === 'current') getCurrentLocation();
  };

  // Step 2a: Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude, type: 'current' });
          fetchRestaurants(latitude, longitude, radius);
        },
        (err) => {
          setError("Location access denied or unavailable.");
          setLocationMethod(null);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLocationMethod(null);
    }
  };

  // Step 2b: Handle custom location submission
  const handleCustomLocation = (e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);

    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid coordinates");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Invalid coordinates values");
      return;
    }

    setUserLocation({ latitude: lat, longitude: lon, type: 'custom' });
    fetchRestaurants(lat, lon, radius);
  };

  // Step 3: Update search with new radius
  const updateRadiusSearch = () => {
    if (!userLocation) return;
    if (radius <= 0) {
      setError("Please enter a valid radius (greater than 0)");
      return;
    }
    
    fetchRestaurants(userLocation.latitude, userLocation.longitude, radius);
  };

  // Common fetch function
  const fetchRestaurants = (lat, lon, rad) => {
    axios.get("http://localhost:8080/restaurants/nearby", {
      params: { userLat: lat, userLon: lon, radiusKm: rad }
    })
    .then(response => {
      setRestaurants(response.data);
      setError("");
    })
    .catch(err => {
      setError("Could not fetch restaurants.");
      console.error("API call failed:", err);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurants Near You</h1>

      {/* Step 1: Location method selection */}
      {!userLocation && (
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold">Choose location method:</h2>
          <div className="space-x-4">
            <button
              onClick={() => selectLocationMethod('current')}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Use Current Location
            </button>
            <button
              onClick={() => setLocationMethod('custom')}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Set Custom Location
            </button>
          </div>
        </div>
      )}

      {/* Step 2b: Custom location form */}
      {locationMethod === 'custom' && !userLocation && (
        <form onSubmit={handleCustomLocation} className="space-y-4 mb-6">
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Enter latitude"
              className="border p-2 rounded"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
            />
            <input
              type="number"
              step="any"
              placeholder="Enter longitude"
              className="border p-2 rounded"
              value={customLon}
              onChange={(e) => setCustomLon(e.target.value)}
            />
          </div>
          <div className="space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Set Location
            </button>
            <button
              type="button"
              onClick={() => setLocationMethod(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Radius adjustment after location is set */}
      {userLocation && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search Radius (km):
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={radius}
                onChange={(e) => setRadius(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-32 border p-2 rounded"
              />
            </div>
            <button
              onClick={updateRadiusSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded self-end"
            >
              Update Radius
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Searching around: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
            <br />
            ({userLocation.type === 'current' ? 'Current Location' : 'Custom Location'})
          </p>
        </div>
      )}

      {error && <div className="text-red-600 mt-2">{error}</div>}

      {/* Results display */}
      {restaurants.length > 0 ? (
        <div className="grid gap-4 mt-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.location}</p>
              <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
              <p><strong>Rating:</strong> {restaurant.rating}</p>
            </div>
          ))}
        </div>
      ) : userLocation && !error && (
        <div className="mt-4">No restaurants found within {radius} kilometers.</div>
      )}
    </div>
  );
}
