import express from "express";
import ItineraryRoute from "./routes/itinerary"
import AIRoute from "./routes/Airoute"
import Others from "./routes/others"
import cors from "cors"
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/v1",ItineraryRoute);
app.use("/api/v1",AIRoute)
app.use("/api/v1",Others)
app.listen(3001);
