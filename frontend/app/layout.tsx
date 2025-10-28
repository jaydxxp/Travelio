import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import React from "react";

export const metadata = {
  title: "Travelio",
  description: "Generate travel itineraries with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100 text-slate-900">
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
