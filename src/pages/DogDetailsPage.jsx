import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function DogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const dogRes = await axios.post(
          "https://frontend-take-home-service.fetch.com/dogs",
          [id],
          { withCredentials: true }
        );
        const dogData = dogRes.data[0];
        setDog(dogData);

        const locationRes = await axios.post(
          "https://frontend-take-home-service.fetch.com/locations",
          [dogData.zip_code],
          { withCredentials: true }
        );
        setLocation(locationRes.data[0]);
      } catch (err) {
        console.error("Failed to fetch dog or location", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!dog) {
    return <div className="text-center mt-10 text-red-500">Dog not found.</div>;
  }

  return (
    <div className="p-6 bg-beige min-h-screen flex flex-col md:flex-row justify-center items-stretch gap-8">

      {/* Info Card */}
      <div className="w-full md:w-1/2 max-w-md bg-[#fefcf9] shadow-md hover:shadow-lg hover:scale-[1.02] transform transition-transform duration-300 rounded-lg p-6 text-center mx-auto">

        <h1 className="text-3xl font-display font-bold text-brown-800 mb-4">{dog.name}</h1>
        {dog.img ? (
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-64 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-600">
            No Image 📷
          </div>
        )}

        <div className="text-left space-y-1 text-brown-700 text-lg">
          <p><strong>Breed:</strong> {dog.breed}</p>
          <p><strong>Age:</strong> {dog.age}</p>
          <p><strong>Zip Code:</strong> {dog.zip_code}</p>
          {location && (
            <>
              <p><strong>City:</strong> {location.city}</p>
              <p><strong>State:</strong> {location.state}</p>
              <p><strong>County:</strong> {location.county}</p>
            </>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-golden hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded w-full"
        >
          Back to Search
        </button>
      </div>

      {/* Map Column */}
      {location && (
      <div className="w-full md:w-1/2 max-w-xl mx-auto flex items-center min-h-[400px]">
      <div className="rounded shadow overflow-hidden w-full h-96 self-center">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              {dog.name} is here! 🐾<br />
              {location.city}, {location.state}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
    
      )}
    </div>
  );
}
