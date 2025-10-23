"use client"
import { useState } from "react";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuggestedTrips() {
  const [hoveredCard, setHoveredCard] = useState(null);
    const router=useRouter();
  const suggestedTrips = [
    {
      id: 1,
      destination: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      highlights: "Ancient temples, cherry blossoms, and traditional tea ceremonies",
      bestTime: "March - May"
    },
    {
      id: 2,
      destination: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      highlights: "Stunning sunsets, white-washed buildings, and azure waters",
      bestTime: "April - October"
    },
    {
      id: 3,
      destination: "Reykjavik, Iceland",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800",
      highlights: "Northern lights, geothermal pools, and volcanic landscapes",
      bestTime: "June - August"
    },
    {
      id: 4,
      destination: "Marrakech, Morocco",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800",
      highlights: "Vibrant souks, stunning riads, and Sahara desert adventures",
      bestTime: "October - April"
    },
    {
      id: 5,
      destination: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      highlights: "Tropical paradise with temples, beaches, and rice terraces",
      bestTime: "April - October"
    },
    {
      id: 6,
      destination: "Prague, Czech Republic",
      image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800",
      highlights: "Medieval architecture, historic castles, and vibrant nightlife",
      bestTime: "May - September"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
        <div className="text-4xl font-semibold cursor-pointer p-8" onClick={()=>router.push("/")}>Travelio</div>
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
              key={trip.id}
              className="relative"
              onMouseEnter={() => setHoveredCard(trip.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 cursor-pointer"
                style={{
                  transform: hoveredCard === trip.id 
                    ? "translateY(-16px) scale(1.03)" 
                    : "translateY(0px) scale(1)"
                }}
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      transform: hoveredCard === trip.id ? "scale(1.15)" : "scale(1)"
                    }}
                  />
                  
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-3xl font-bold mb-3">{trip.destination}</h3>
                    
                    <p className="text-white/95 text-sm mb-4 leading-relaxed">
                      {trip.highlights}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-white/90 mb-5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 w-fit">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{trip.bestTime}</span>
                    </div>

                    <button 
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-all duration-300"
                      style={{
                        background: hoveredCard === trip.id 
                          ? "rgba(255, 255, 255, 0.95)" 
                          : "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        color: hoveredCard === trip.id ? "#0284c7" : "white",
                        border: hoveredCard === trip.id ? "2px solid rgba(2, 132, 199, 0.3)" : "2px solid rgba(255, 255, 255, 0.2)"
                      }}
                    >
                      <span>Explore Trip</span>
                      <ArrowRight 
                        className="w-4 h-4 transition-transform"
                        style={{
                          transform: hoveredCard === trip.id ? "translateX(4px)" : "translateX(0px)"
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div 
                className="absolute inset-0 rounded-3xl blur-2xl transition-all duration-500 -z-10"
                style={{
                  background: "linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(59, 130, 246, 0.4))",
                  opacity: hoveredCard === trip.id ? 1 : 0,
                  transform: hoveredCard === trip.id ? "translateY(24px) scale(0.92)" : "translateY(16px) scale(0.88)"
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}