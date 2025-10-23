"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Papa from "papaparse";
import axios from "axios";
import AIStreamingButton  from "./AIStreamingbutton";
import { useRouter } from "next/navigation";

export default function TravelSearchForm() {
  const router = useRouter();
    const Backendurl=process.env.NEXT_PUBLIC_Backendurl;
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interest, setInterest] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions = [
    "Adventure",
    "Beach",
    "Culture",
    "Food",
    "Nature",
    "Shopping",
    "Nightlife",
    "Other",
  ];

  
  useEffect(() => {
    Papa.parse("/world-cities.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data) return;

        
        const cityList = (results.data as any[])
          .filter((row) => row.name && row.country) 
          .map((row) => `${row.name}, ${row.country}`);

        setCities(cityList);
      },
      error: (err) => {
        console.error("CSV parsing error:", err);
      },
    });
  }, []);

  useEffect(() => {
    if (!destination) {
      setSuggestions([]);
      return;
    }

    const filtered = cities
      .filter((city) =>
        city.toLowerCase().startsWith(destination.toLowerCase())
      )
      .slice(0, 10); 
    setSuggestions(filtered);
  }, [destination, cities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const finalInterest = interest === "Other" ? customInterest : interest;

    const payload = {
      destination,
      startDate,
      endDate,
      interests: finalInterest ? [finalInterest] : [],
    };

    try {
      setIsLoading(true);
      const resp = await axios.post(
        `${Backendurl}/api/v1/generate-itinerary`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Itinerary response:", resp.data);

      const shareableId = resp.data?.shareableId || resp.data?._id || resp.data?.id;
      if (shareableId) {
    
        router.push(`/trip/${shareableId}`);
        return;
      } else {
      
        setSuggestions([]);
      }
    } catch (err: any) {
      console.error("Request error:", err);
      setError(err?.response?.data?.message || err.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pt-16 max-w-sm">
      <div className="font-bold text-4xl text-center mb-5">Plan Your Trip</div>
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-3xl shadow-2xl p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
         
          <div className="relative">
            <label
              htmlFor="destination"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Destination
            </label>
            <input
              id="destination"
              type="text"
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
                {suggestions.map((city, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setDestination(city);
                      setSuggestions([]);
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
            />
          </div>

 
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900"
            />
          </div>

     
          <div>
            <label
              htmlFor="interest"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Interest
            </label>
            <div className="relative">
              <select
                id="interest"
                value={interest}
                onChange={(e) => {
                  setInterest(e.target.value);
                  if (e.target.value !== "Other") {
                    setCustomInterest("");
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">Select an interest</option>
                {interestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

   
          {interest === "Other" && (
            <div>
              <label
                htmlFor="customInterest"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Custom Interest
              </label>
              <input
                id="customInterest"
                type="text"
                placeholder="Tell us your interest..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors bg-blue-50 text-gray-900 placeholder-gray-400"
              />
            </div>
          )}


          <div className="pt-1 pb-2">
            <AIStreamingButton isLoading={isLoading} />
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
