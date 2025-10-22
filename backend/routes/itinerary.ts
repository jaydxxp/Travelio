import express, { Request, Response } from "express"
import { IItinerary, ISuggestedTrip, Itinerary, SuggestedTrip } from "../model";
const router=express.Router();
router.post("/itineraries",async (req:Request,res:Response)=>{
    const data:Partial<IItinerary>=req.body;
    const itinerary= new Itinerary(data);
    await itinerary.save();
    res.json({
        message:(itinerary)
    })
})
router.get("/itineraries",async (req:Request,res:Response)=>{
    const itineraries=await Itinerary.find();
    res.json(itineraries);
})
router.get("/itineraries/:id",async(req:Request,res:Response)=>{
    const itinerary= await Itinerary.findById(req.params.id);
    if(!itinerary) return res.status(404).json({
        message:"No Itinerary found"
    })
    res.json(itinerary);
})
router.get('/itinerary/:shareableId', async (req, res) => {
  const { shareableId } = req.params;
  const itinerary = await Itinerary.findOne({ shareableId });
  if (!itinerary) return res.status(404).json({ message: 'Trip not found' });
  res.json(itinerary);
});

router.post('/suggested-trips', async (req: Request, res: Response) => {
  try {
    const data: Partial<ISuggestedTrip> = req.body;
    const trip = new SuggestedTrip(data);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
router.get('/suggested-trips', async (_req: Request, res: Response) => {
  try {
    const trips = await SuggestedTrip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;