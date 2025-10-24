"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Cloud, Calendar, Clock, ArrowLeft, Share2, Check } from "lucide-react";

export default function TripItinerary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
    const Backendurl=process.env.NEXT_PUBLIC_Backendurl;

  useEffect(() => {
    const parts = typeof window !== "undefined" ? window.location.pathname.split("/") : [];
    const shareableId = parts?.[parts.length - 1];
    if (!shareableId) {
      setError("Missing trip id in URL");
      setLoading(false);
      return;
    }

    const fetchTrip = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`${Backendurl}/api/v1/itinerary/${shareableId}`);
        setTripData(resp.data);
        
        const firstDay = resp.data?.activities?.[0]?.day ?? 1;
        setSelectedDay(firstDay);
      } catch (err: any) {
        console.error("Failed to load trip:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, []);

  const shareUrl = typeof window !== "undefined" && tripData?.shareableId
    ? `${window.location.origin}/trip/${tripData.shareableId}`
    : "";

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareVia = (platform: string) => {
    if (!shareUrl) return;
    const text = `Check out my trip to ${tripData.destination || ""}!`;
    const urls: Record<string,string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform], '_blank');
    setShowShareMenu(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-6">Loading trip...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center p-6 text-red-600">{error}</div>;
  }

  if (!tripData) {
    return <div className="min-h-screen flex items-center justify-center p-6">No trip data</div>;
  }

  const currentDayActivities = tripData.activities?.find((a:any) => a.day === selectedDay);

  return (
    <div className="min-h-screen bg-slate-50" onClick={() => showShareMenu && setShowShareMenu(false)}>
 
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6" onClick={(e) => e.stopPropagation()}>
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
            <span>Back to trips</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{tripData.destination}</h1>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(tripData.travelDates?.start)} - {formatDate(tripData.travelDates?.end)}</span>
                </div>
                <div className="flex gap-2">
                  {Array.isArray(tripData.interests) && tripData.interests.map((interest:string, idx:number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

    
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                Share Trip
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">Share this trip</p>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between group"
                  >
                    <span className="text-sm text-slate-700">Copy link</span>
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-slate-300 rounded group-hover:border-blue-500" />
                    )}
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => handleShareVia('whatsapp')}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700"
                    >
                      Share via WhatsApp
                    </button>
                    <button
                      onClick={() => handleShareVia('twitter')}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShareVia('facebook')}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShareVia('email')}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700"
                    >
                      Share via Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 py-4">
            {Array.isArray(tripData.activities) && tripData.activities.map((dayData:any) => (
              <button
                key={dayData.day}
                onClick={() => setSelectedDay(dayData.day)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedDay === dayData.day
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Day {dayData.day}
              </button>
            ))}
          </div>
        </div>
      </div>

     
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {currentDayActivities?.plans?.map((plan:any, idx:number) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-5 gap-0">
                
                <div className="md:col-span-2 relative h-64 md:h-auto">
                  <img
                    src={plan.imageUrl}
                    alt={plan.location}
                    className="w-full h-full object-cover"
                  />
                  {plan.weather && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{plan.weather.temp}°C</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{plan.weather.description}</div>
                    </div>
                  )}
                </div>

      
                <div className="md:col-span-3 p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-center mt-2 text-sm font-semibold text-slate-900">{plan.time}</div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">{plan.activity}</h3>
                      
                      <div className="flex items-start gap-2 text-slate-600 mb-4">
                        <MapPin className="w-4 h-4 mt-1 shrink-0 text-blue-500" />
                        <span className="text-sm">{plan.location}</span>
                      </div>

                      <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${plan.lat},${plan.lng}`, '_blank')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        View on map
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!currentDayActivities || !currentDayActivities.plans?.length) && (
            <div className="text-center py-8 text-slate-600">No activities for this day.</div>
          )}
        </div>
      </div>
    </div>
  );
}