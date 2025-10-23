"use client"
import { useEffect, useState } from "react";

type Props = {
  isLoading: boolean;
};

export default function AIStreamingButton({ isLoading }: Props) {
  const [currentThought, setCurrentThought] = useState(0);

  const thoughts = [
    "Analyzing with Gemini AI",
    "Fetching weather data",
    "Finding photos",
    "Mapping coordinates",
    "Building your itinerary"
  ];

  useEffect(() => {
    if (!isLoading) {
      setCurrentThought(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentThought((prev) => (prev + 1) % thoughts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
   
    <div className="w-full pt-2 pb-6">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <svg viewBox="0 0 50 50" className="w-5 h-5 animate-spin-slow">
              <polygon 
                points="25,2 47,14 47,36 25,48 3,36 3,14" 
                fill="none" 
                stroke="white" 
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
            <span className="text-sm font-medium">{thoughts[currentThought]}</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-500"
              fill="currentColor"
            >
              <path d="M22.625 2c0 15.834-8.557 30-20.625 30c12.068 0 20.625 14.167 20.625 30c0-15.833 8.557-30 20.625-30c-12.068 0-20.625-14.166-20.625-30" />
              <path d="M47 32c0 7.918-4.277 15-10.313 15C42.723 47 47 54.084 47 62c0-7.916 4.277-15 10.313-15C51.277 47 47 39.918 47 32z" />
              <path d="M51.688 2c0 7.917-4.277 15-10.313 15c6.035 0 10.313 7.084 10.313 15c0-7.916 4.277-15 10.313-15c-6.036 0-10.313-7.083-10.313-15" />
            </svg>
            <span className="tracking-wide">Generate Trip</span>
          </span>
        )}
      </button>

      <p className="text-center text-sm text-slate-600 mt-3 font-medium">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-1 h-1 bg-sky-500 rounded-full animate-pulse" />
            <span>AI is crafting your itinerary</span>
            <span className="inline-block w-1 h-1 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </span>
        ) : (
          "Click to generate your personalized trip"
        )}
      </p>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
}