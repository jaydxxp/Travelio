"use client";
import TravelSearchForm from "@/components/Inputbox";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient text-black">
      <div className="flex justify-between items-center p-8">
        <div className="text-4xl font-semibold cursor-pointer" onClick={() => router.push("/")}>Travelio</div>

        <button
          className="px-5 py-1 rounded-full font-semibold bg-linear-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 cursor-pointer"
          onClick={() => router.push("/suggested")}
        >
          Suggested Trips
        </button>
      </div>


      <div className="relative flex flex-col items-center px-4 pt-20 pb-16 gap-5 overflow-visible">

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none -z-20"
          style={{ transform: "translateY(90px)" }} 
        >
          <div className="w-[420px] sm:w-[600px] md:w-[900px] opacity-95">
           
          </div>
        </div>


        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 flex items-center justify-center"
          style={{
            width: "min(880px, 92%)",
            height: "min(220px, 36vh)",
            borderRadius: 28,
           
            background: "linear-gradient(180deg, rgba(14,165,233,0.22) 0%, rgba(14,165,233,0.12) 45%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            mixBlendMode: "screen",
          }}
        />


        <div className="relative z-20 text-center">
          <h2 className="text-5xl font-semibold inter-800 max-w-3xl leading-tight mx-auto">
            Tell us where you want to go,
            <br />
            we'll handle the rest.
          </h2>

          <div className="mt-6">
            <button
              className="px-8 py-2 rounded-full font-semibold bg-linear-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 cursor-pointer"
              onClick={() => router.push("/generate")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
