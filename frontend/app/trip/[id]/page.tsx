import TripItinerary from "@/components/trip";

export default function TripPage({ params }: { params: { id: string } }) {
  
  return (
    <div className="min-h-screen bg-white ">
      <TripItinerary />
      
      </div>)
}