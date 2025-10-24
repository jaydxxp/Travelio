"use client"
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Sparkles, Cloud, Hotel, Share2, Check } from "lucide-react";
import axios from "axios";


type Weather = {
  date?: string;
  temp?: number;
  description?: string;
  icon?: string;
};

type Plan = {
  time?: string;
  activity?: string;
  location?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  weather?: Weather;
  _id?: string;
};

type DayActivity = {
  day: number;
  plans: Plan[];
  _id?: string;
};

type Place = {
  name: string;
  description?: string;
  image?: string;
  time?: string;
};

type Accommodation = {
  budget?: string;
  mid?: string;
  luxury?: string;
};

type BestTime = {
  months?: string;
  weather?: string;
  tip?: string;
};

type SuggestedTrip = {
  _id?: string;
  shareableId?: string;
  destination?: string;
  country?: string;
  image?: string;
  description?: string;
  bestTime?: BestTime;
  duration?: string;
  highlights?: string[];
  activities?: DayActivity[];
  placesToVisit?: Place[];
  accommodation?: Accommodation;
  travelTips?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export default function TripDetailPage({ id }: { id?: string }) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [tripDetail, setTripDetail] = useState<SuggestedTrip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const Backendurl=process.env.NEXT_PUBLIC_Backendurl;
  useEffect(() => {
    let resolvedId = id;
    if (!resolvedId) {
      const parts = typeof window !== "undefined" ? window.location.pathname.split("/") : [];
      resolvedId = parts?.[parts.length - 1];
    }
    if (!resolvedId) {
      setError("No suggested trip id provided");
      setLoading(false);
      return;
    }

    const fetchTrip = async () => {
      try {
        setLoading(true);
        const resp = await axios.get<SuggestedTrip>(`${Backendurl}/api/v1/suggested-trips/${resolvedId}`);
        setTripDetail(resp.data ?? null);
      } catch (err: any) {
        console.error("Failed to fetch suggested trip:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleCopyLink = () => {
    if (!tripDetail) return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareVia = (platform: string) => {
    if (!tripDetail) return;
    const text = `Check out this trip to ${tripDetail.destination ?? "this destination"}!`;
    const url = window.location.href;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    };
    window.open(urls[platform], "_blank");
    setShowShareMenu(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-6">Loading trip...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center p-6 text-red-600">{error}</div>;
  }

  if (!tripDetail) {
    return <div className="min-h-screen flex items-center justify-center p-6">No trip data</div>;
  }

  const highlights = tripDetail.highlights ?? [];
  const activities = tripDetail.activities ?? [];
  const places = tripDetail.placesToVisit ?? [];
  const travelTips = tripDetail.travelTips ?? [];
  const accommodation = tripDetail.accommodation ?? {};

  return (
    <div className="min-h-screen bg-slate-50" onClick={() => showShareMenu && setShowShareMenu(false)}>
      
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent z-10" />
        <img
          src={tripDetail.image ?? "/placeholder.svg"}
          alt={tripDetail.destination ?? "Destination"}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-white/80 w-fit bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-5xl font-bold text-white mb-2">{tripDetail.destination ?? "Unknown destination"}</h1>
            <p className="text-white/90 text-lg">{tripDetail.country ?? ""}</p>
          </div>
        </div>
      </div>

 
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{tripDetail.bestTime?.months ?? "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{tripDetail.duration ?? "N/A"}</span>
            </div>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
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
                  <button onClick={() => handleShareVia("whatsapp")} className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700">
                    Share via WhatsApp
                  </button>
                  <button onClick={() => handleShareVia("twitter")} className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700">
                    Share on Twitter
                  </button>
                  <button onClick={() => handleShareVia("facebook")} className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700">
                    Share on Facebook
                  </button>
                  <button onClick={() => handleShareVia("email")} className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm text-slate-700">
                    Share via Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 leading-relaxed">{tripDetail.description ?? "No description available."}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900">Best Time to Visit</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{tripDetail.bestTime?.months ?? "N/A"}</p>
                <p className="text-slate-600 text-sm">{tripDetail.bestTime?.weather ?? ""}</p>
              </div>
            </div>
            {tripDetail.bestTime?.tip && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900"><span className="font-semibold">Pro tip:</span> {tripDetail.bestTime?.tip}</p>
              </div>
            )}
          </div>
        </div>

      
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900">Trip Highlights</h2>
          </div>
          <ul className="space-y-3">
            {highlights.length ? (
              highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-600">No highlights available.</li>
            )}
          </ul>
        </div>


        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Activities</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activities.length ? (
              activities.flatMap((day) => day.plans ?? []).map((activity, idx) => {
                const IconComp: any = (activity as any).icon;
                return (
                  <div key={activity._id ?? idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      {IconComp && typeof IconComp === "function" ? (
                        <IconComp className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{activity.activity ?? "Activity"}</h3>
                      <p className="text-sm text-slate-600">{activity.location ?? ""}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-600">No activities listed.</div>
            )}
          </div>
        </div>

      
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900">Must-Visit Places</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {places.length ? (
              places.map((place, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                  <div className="relative h-48">
                    <img src={place.image ?? "/placeholder.svg"} alt={place.name ?? "Place"} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-slate-900">{place.time ?? ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">{place.name ?? "Place"}</h3>
                    <p className="text-sm text-slate-600">{place.description ?? ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-600">No places listed.</div>
            )}
          </div>
        </div>

   
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Hotel className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900">Accommodation</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Budget</span>
              <span className="text-slate-600">{accommodation.budget ?? "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Mid-range</span>
              <span className="text-slate-600">{accommodation.mid ?? "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Luxury</span>
              <span className="text-slate-600">{accommodation.luxury ?? "N/A"}</span>
            </div>
          </div>
        </div>


        <div className="bg-linear-to-br from-blue-50 to-sky-50 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Travel Tips</h2>
          <ul className="space-y-3">
            {travelTips.length ? (
              travelTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-700">No travel tips available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}