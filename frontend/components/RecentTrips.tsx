"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import axios from "axios"

interface Trip {
  id: string
  destination: string
  image: string
  startDate: string
  endDate: string
}

const placeholder = "/placeholder.svg"

function formatDate(dateStr?: string) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr 
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function parseDestination(dest?: string) {
  if (!dest) return { city: "", country: "" }
  const parts = dest.split(",").map((p) => p.trim())
  return {
    city: parts[0] || "",
    country: parts.slice(1).join(", ") || "",
  }
}

export default function RecentTrips() {
  const router = useRouter()
  const Backendurl=process.env.NEXT_PUBLIC_Backendurl;
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchItineraries = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await axios.get(`${Backendurl}/api/v1/itineraries`)
        const data = Array.isArray(resp.data) ? resp.data : []

        const sorted = data.slice().sort((a: any, b: any) => {
          const timeA =
            Date.parse(a.createdAt) ||
            Date.parse(a.travelDates?.start) ||
            Date.parse(a.startDate) ||
            0
          const timeB =
            Date.parse(b.createdAt) ||
            Date.parse(b.travelDates?.start) ||
            Date.parse(b.startDate) ||
            0
          return timeB - timeA
        })

        const mapped: Trip[] = sorted.slice(0, 8).map((it: any, idx: number) => {
          const { city, country } = parseDestination(it.destination)


          const rawStart = it.travelDates?.start || it.startDate || it.start
          const rawEnd = it.travelDates?.end || it.endDate || it.end

     
          const activityImage =
            it.activities?.[0]?.plans?.[0]?.imageUrl ||
            it.activities?.[0]?.imageUrl
          const image = it.image || it.coverImage || activityImage || placeholder

          const id = it.shareableId || it._id || String(idx)

          return {
            id,
            destination:
              city && country
                ? `${city}, ${country}`
                : it.destination || `${city}${country ? `, ${country}` : ""}`,
            image,
            startDate: formatDate(rawStart),
            endDate: formatDate(rawEnd),
          }
        })

        if (mounted) setTrips(mapped)
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.message || err.message || "Failed to load trips")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchItineraries()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">

        <div className="mb-5">
          <div className="text-4xl md:text-4xl font-bold text-center text-slate-900 mb-2">Recently Created Trips</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-2xl p-6 md:p-8">
          {loading && <div className="text-center py-6 text-sm text-slate-600">Loading recent trips...</div>}
          {error && <div className="text-center py-6 text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-4 gap-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                role="button"
                onClick={() => router.push(`/trip/${trip.id}`)}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="relative h-24 overflow-hidden bg-gradient-to-br from-blue-200 to-cyan-200">
                  <img
                    src={trip.image || placeholder}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-2">
                  <h3 className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">{trip.destination}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <span className="text-xs">
                      {trip.startDate} {trip.startDate && trip.endDate ? " - " : ""} {trip.endDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {!loading && trips.length === 0 && !error && (
              <div className="col-span-4 text-center py-6 text-sm text-slate-600">No recent trips found</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
