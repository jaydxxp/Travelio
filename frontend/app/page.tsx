"use client";

import TravelSearchForm from "@/components/Inputbox";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useRouter } from "next/navigation";

export default function Home() {
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

      
      <div className="flex flex-col items-center px-4 pt-35 pb-16 gap-5">
        <div className="text-5xl font-semibold inter-800 text-center max-w-3xl leading-tight">
          Tell us where you want to go,
          <br />
          we'll handle the rest.
        </div>

        <button
          className="px-8 py-2 rounded-full font-semibold bg-linear-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 cursor-pointer"
          onClick={() => router.push("/generate")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
