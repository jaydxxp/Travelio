"use client";
import TravelSearchForm from "@/components/Inputbox";
import RecentTrips from "@/components/RecentTrips";
import { useRouter } from "next/navigation";

export default function Generate() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient text-black">
 
      <div className="flex justify-between items-center p-8">
        <div className="text-4xl font-semibold cursor-pointer" onClick={()=>router.push("/")}>Travelio</div>

        <button
          className="px-5 py-1 rounded-full font-semibold bg-linear-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 cursor-pointer"
          onClick={() => router.push("/suggested")}
        >
          Suggested Trips
        </button>
      </div>

  
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center px-4">
        <TravelSearchForm />
        <RecentTrips />
      </div>
    </div>
  );
}
