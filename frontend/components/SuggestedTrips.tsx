"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuggestedTrip {
  _id: string;
  destination: string;
  country: string;
  image: string;
  description:string;
  highlights: string[];
  bestTime: {
    months: string;
    weather: string;
    tip: string;
  };
}

export default function SuggestedTrips() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [suggestedTrips, setSuggestedTrips] = useState<SuggestedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const Backendurl=process.env.NEXT_PUBLIC_Backendurl;
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${Backendurl}/api/v1/suggested-trips`);
        setSuggestedTrips(response.data);
      } catch (err: any) {
        console.error("Failed to fetch trips:", err);
        setError("Failed to load trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-sky-50 to-blue-50 text-sky-600 text-lg font-medium">
        Loading suggested trips...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-sky-50 to-blue-50 text-red-600 text-lg font-medium">
        {error}
      </div>
    );
  }
  const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text;
};

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-blue-50">

      <div className="w-full px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6">
          <div
            className="text-4xl font-semibold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Travelio
          </div>

          <div>
            <button
              className="px-5 py-1 rounded-full font-semibold bg-linear-to-b from-blue-600 to-sky-600 text-white focus:ring-2 focus:ring-sky-400 hover:shadow-xl transition duration-200 cursor-pointer"
              onClick={() => router.push("/generate")}
            >
              Plan a Trip
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8 text-sky-500" />
          <h1 className="text-4xl font-bold text-slate-900">Suggested Trips</h1>
        </div>
        <p className="text-slate-600 text-lg mb-12">
          Handpicked destinations for your next adventure
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestedTrips.map((trip) => (
            <div
              key={trip._id}
              className="relative"
              onMouseEnter={() => setHoveredCard(trip._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 cursor-pointer"
                style={{
                  transform:
                    hoveredCard === trip._id
                      ? "translateY(-16px) scale(1.03)"
                      : "translateY(0px) scale(1)",
                }}
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      transform: hoveredCard === trip._id ? "scale(1.15)" : "scale(1)",
                    }}
                  />

                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-3xl font-bold mb-3">{trip.destination}</h3>

                    <p className="text-white/95 text-sm mb-4 leading-relaxed">
  {truncateText(trip.description, 25)}
</p>


                    <div className="flex items-center gap-2 text-sm text-white/90 mb-5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 w-fit">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{trip.bestTime?.months}</span>
                    </div>

                    <button
  onClick={() => router.push(`/suggested/${trip._id}`)}
  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-all duration-300"
  style={{
    background:
      hoveredCard === trip._id
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    color: hoveredCard === trip._id ? "#0284c7" : "white",
    border:
      hoveredCard === trip._id
        ? "2px solid rgba(2, 132, 199, 0.3)"
        : "2px solid rgba(255, 255, 255, 0.2)",
  }}
>
  <span>Explore Trip</span>
  <ArrowRight
    className="w-4 h-4 transition-transform"
    style={{
      transform:
        hoveredCard === trip._id ? "translateX(4px)" : "translateX(0px)",
    }}
  />
</button>

                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 rounded-3xl blur-2xl transition-all duration-500 -z-10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(59, 130, 246, 0.4))",
                  opacity: hoveredCard === trip._id ? 1 : 0,
                  transform:
                    hoveredCard === trip._id
                      ? "translateY(24px) scale(0.92)"
                      : "translateY(16px) scale(0.88)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
