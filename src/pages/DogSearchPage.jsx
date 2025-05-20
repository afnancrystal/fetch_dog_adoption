import Toast from "../components/Toast";
import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DogSearchPage() {
  const [availableStates, setAvailableStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [sortField, setSortField] = useState("breed");
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({ total: 10000, from: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => setToastMessage(msg);
  const [searchMode, setSearchMode] = useState("zip");
  const [locationInput, setLocationInput] = useState("");
  const [allZipCodes, setAllZipCodes] = useState([]);

  const fetchAvailableStates = async () => {
    try {
      const res = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations/search",
        { size: 1000 },
        { withCredentials: true }
      );
      const uniqueStates = [
        ...new Set(res.data.results.map((loc) => loc.state)),
      ].sort();
      setAvailableStates(uniqueStates);
    } catch {
      console.error("Failed to fetch states.");
    }
  };
  

  useEffect(() => {
    fetchAvailableStates();
  }, []);

  const fetchAllZipCodes = async () => {
    try {
      const res = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations/search",
        { size: 1000 },
        { withCredentials: true }
      );
      const zips = res.data.results.map((loc) => String(loc.zip_code));
      setAllZipCodes(zips);
    } catch {
      console.error("Failed to fetch zip codes");
    }
  };

const handleLocationInput = (input) => {
    setLocationInput(input);
  
    if (input.length === 5) {
      // Check if it's a valid 5-digit zip code
      fetchDogs(0, [input]); // Fetch dogs for this zip
      setCurrentPage(1);
    } else if (input.length === 0) {
      // If the input is cleared, fetch all results
      fetchDogs(0); // Fetch all dogs (without zip code filter)
      setCurrentPage(1);
    }
  };
  
const handleLocationSearch = async (selected = null) => {
    const input = selected || locationInput;
  
    if (!/^\d{5}$/.test(input)) {
      showToast("Please enter a valid 5-digit ZIP code.");
      return;
    }
  
    setLoading(true);
    
    try {
      const dogResponse = await fetchDogs(0, [input]);
      
      // If no dogs found for that ZIP code
      if (!dogResponse || dogResponse.length === 0) {
        showToast("No furry friends here!");
        
        // Fetch all dogs
        setLocationInput("");
        
        // Clear ZIP code filter and fetch all results
        setZipCode("");
        fetchDogs(0); // Fetch all dogs without ZIP filter
        setCurrentPage(1);
        
        setLoading(false);
        return;
      }
      
      // If dogs are found, update the state as normal
      setZipCode(input);
      setLocationInput("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching by location:", error);
      showToast("An error occurred while searching. Please try again.");
      
      // On error, fetch all results
      setZipCode("");
      fetchDogs(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllZipCodes();
  }, []);

  useEffect(() => {
    fetchBreeds();
    fetchDogs();
  }, [selectedBreed, sortOrder, sortField]);

  const pageSize = 100;
  const navigate = useNavigate();

  const fetchBreeds = async () => {
    try {
      const res = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        { withCredentials: true }
      );
      setBreeds(res.data);
    } catch {
      setError("Failed to fetch breeds.");
    }
  };

  const fetchDogs = async (from = 0, zipCodes = []) => {
    try {
      setLoading(true);
      setError("");
  
      const params = new URLSearchParams();
      if (selectedBreed) params.append("breeds", selectedBreed);
      if (zipCodes.length > 0) params.append("zipCodes", zipCodes.join(","));
      params.append("size", pageSize);
      params.append("from", from);
      params.append("sort", `${sortField}:${sortOrder}`);
  
      const res = await axios.get(
        `https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`,
        { withCredentials: true }
      );
  
      // 🚫 No matches? Skip second API call
      if (!res.data.resultIds || res.data.resultIds.length === 0) {
        setDogs([]);
        setPagination({ total: 0, from });
        setLoading(false);
        return [];
      }
  
      const dogDetails = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        res.data.resultIds,
        { withCredentials: true }
      );
  
      setDogs(dogDetails.data);
      setPagination({ total: res.data.total || 0, from });
      setLoading(false);
  
      return dogDetails.data;
    } catch {
      setError("Failed to fetch dogs.");
      setLoading(false);
      return null;
    }
  };
  
  

  const handleFavorite = (dogId) => {
    if (!favorites.includes(dogId) && favorites.length === 0) {
      showToast("You can favorite up to 100 dogs!");
    }
    if (favorites.length >= 100 && !favorites.includes(dogId)) {
      showToast("Favorite limit reached (100 dogs).");
      return;
    }

    setFavorites((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    );
  };

  const handleMatch = async () => {
    if (favorites.length === 0) return setError("Add some favorites first!");
    try {
      const res = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favorites,
        { withCredentials: true }
      );
      const matchedDogId = res.data.match;

      const matchDetails = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        [matchedDogId],
        { withCredentials: true }
      );

      setMatchResult(matchDetails.data[0] || null);
      setShowModal(true);
    } catch {
      setError("Failed to find a match.");
    }
  };

  const handlePageClick = (pageNumber) => {
    const newFrom = (pageNumber - 1) * pageSize;
    fetchDogs(newFrom);
    setCurrentPage(pageNumber);
  };

  const clearFilters = () => {
    setSelectedBreed("");
    setZipCode("");
    setSortOrder("asc");
    fetchDogs(0);
  };

  const totalPages = Math.ceil(pagination.total / pageSize);

  const generatePagination = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      if (start > 1) pages.push(1, "...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <div className="p-4 bg-beige min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left mb-8 bg-gradient-to-r from-[#f7e7ce] to-[#f3dcc1] border border-brown-200 p-6 rounded-2xl shadow-lg gap-4">
        <img
          src={logo}
          alt="Pawtastic Rescue Logo"
          className="w-24 h-24 sm:w-20 sm:h-20 object-contain"
        />
        <div className="text-center">
          <h1 className="text-5xl font-display font-extrabold text-brown-800 leading-tight drop-shadow-sm">
            Pawtastic Rescue
          </h1>
          <p className="text-brown-700 text-lg leading-snug">
            Bringing Hope, One Bark at a Time
          </p>
          <p className="text-brown-500 text-sm italic leading-snug">
            Powered by the Spirit of Fido
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            placeholder="Enter ZIP Code"
            className="border p-2 rounded w-64"
            value={locationInput}
            onChange={(e) => handleLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLocationSearch();
            }}
          />
        </div>

        <select
          className="border p-2 rounded"
          value={`${sortField}:${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split(":");
            setSortField(field);
            setSortOrder(order);
          }}
        >
          <option value="breed:asc" disabled hidden>
            Sort By...
          </option>
          <optgroup label="Breed">
            <option value="breed:asc">Breed (A–Z)</option>
            <option value="breed:desc">Breed (Z–A)</option>
          </optgroup>
          <optgroup label="Name">
            <option value="name:asc">Name (A–Z)</option>
            <option value="name:desc">Name (Z–A)</option>
          </optgroup>
          <optgroup label="Age">
            <option value="age:asc">Age (Youngest)</option>
            <option value="age:desc">Age (Oldest)</option>
          </optgroup>
        </select>

        <button
          onClick={handleMatch}
          className="bg-gradient-to-r from-brown-600 to-golden  hover:from-yellow-400 hover:to-brown-800 text-white font-bold px-4 py-2 rounded shadow-md transition duration-300"
        >
          Find My Match ❤️
        </button>

        <button
          onClick={clearFilters}
          className="bg-brown-600 hover:bg-brown-700 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-brown-800 border-solid"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className="border border-brown-200 p-4 rounded-lg bg-[#fefcf9] shadow-md hover:shadow-lg hover:scale-[1.02] transform transition-transform duration-300 flex flex-col items-center text-center"
              >
                {dog.img ? (
                  <img
                    src={dog.img}
                    alt={dog.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-brown-100 flex items-center justify-center rounded mb-4 text-brown-600">
                    Picture Coming Soon 📷
                  </div>
                )}

                <h2 className="text-xl font-bold text-brown-800 mb-2">
                  {dog.name}
                </h2>
                <p className="text-brown-700">
                  <strong>Breed:</strong> {dog.breed}
                </p>
                <p className="text-brown-700">
                  <strong>Age:</strong> {dog.age}
                </p>
                <p className="text-brown-700">
                  <strong>Zip Code:</strong> {dog.zip_code}
                </p>

                <button
                  onClick={() => handleFavorite(dog.id)}
                  className={`px-4 py-2 mt-2 rounded font-semibold transition duration-200 ${
                    favorites.includes(dog.id)
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#e8d4bb] hover:bg-[#dcc4a8] text-brown-900 border border-brown-400"
                  }`}
                >
                  {favorites.includes(dog.id) ? "❤️ Unfavorite" : "🤍 Favorite"}
                </button>

                <button
                  onClick={() => window.open(`/dog/${dog.id}`, "_blank")}
                  className="mt-2 bg-golden hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center flex-wrap gap-2 mt-8">
            {generatePagination().map((item, idx) =>
              item === "..." ? (
                <span key={idx} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageClick(item)}
                  className={`px-3 py-1 rounded ${
                    currentPage === item
                      ? "bg-brown-800 text-white font-bold"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </>
      )}

      {showModal && matchResult && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg relative max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2 text-brown-800">
              🎉 Your Perfect Match! 🎉
            </h2>
            <h3 className="text-xl font-semibold">{matchResult.name}</h3>
            <p>
              <strong>Breed:</strong> {matchResult.breed}
            </p>
            <p>
              <strong>Age:</strong> {matchResult.age}
            </p>
            <p>
              <strong>Zip Code:</strong> {matchResult.zip_code}
            </p>
            <button
              className="mt-4 bg-golden hover:bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => window.open(`/dog/${matchResult.id}`, "_blank")}
            >
              View Details
            </button>
          </div>
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
