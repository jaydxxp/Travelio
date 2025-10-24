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


router.get('/suggested-trips/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trip = await SuggestedTrip.findById(id);
    if (!trip) return res.status(404).json({ message: 'Suggested trip not found' });
    return res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching suggested trip:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/suggested-trips', async (req: Request, res: Response) => {
  try {
    const { country, destination } = req.query;

 
    const filter: any = {};
    if (country) filter.country = { $regex: new RegExp(country as string, 'i') };
    if (destination) filter.destination = { $regex: new RegExp(destination as string, 'i') };

    const trips = await SuggestedTrip.find(filter).sort({ createdAt: -1 });

    if (!trips.length) {
      return res.status(404).json({ message: 'No suggested trips found' });
    }

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;