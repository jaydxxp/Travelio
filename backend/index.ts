import express from "express";
import ItineraryRoute from "./routes/itinerary"
import AIRoute from "./routes/Airoute"
import Others from "./routes/others"
const app=express();
app.use(express.json());
app.use("/api/v1",ItineraryRoute);
app.use("/api/v1",AIRoute)
app.use("/api/v1",Others)
app.listen(3000);
