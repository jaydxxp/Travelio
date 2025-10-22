import express, { Request, Response } from 'express';
import { Itinerary, IItinerary } from '../model';
import { GoogleGenAI } from '@google/genai';
import { getCoordinates } from '../utils/mapbox';
import { getWeather } from '../utils/weatherbit';
import { getPhoto } from '../utils/unsplash';

const router = express.Router();
router.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.Gemini_ApiKey });
if (!process.env.Gemini_ApiKey) throw new Error('Gemini API key not set');

interface IAiRequestBody {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[] | string;
}

router.post('/generate-itinerary', async (req: Request, res: Response) => {
  try {
    const { destination, startDate, endDate, interests }: IAiRequestBody = req.body;

    if (!destination || !startDate || !endDate || !interests) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const interestsArray = Array.isArray(interests) ? interests : [interests];

    const prompt = `
Create a day-wise travel itinerary for ${destination} from ${startDate} to ${endDate}.
Interests: ${interestsArray.join(', ')}.
Return ONLY a JSON array with this exact structure:

[
  {
    "day": 1,
    "plans": [
      { "time": "10:00", "activity": "Visit Eiffel Tower", "location": "Eiffel Tower" }
    ]
  }
]

Do NOT include any text outside of JSON.
`;

    console.log('Prompt sent to AI:', prompt);

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let aiText = aiResponse.text as string;

aiText = aiText.replace(/^```json\s*/, '').replace(/```$/, '').trim();

    let activities: IItinerary['activities'];
    try {
      activities = JSON.parse(aiText);
      if (!Array.isArray(activities)) throw new Error('AI returned invalid activities array');
    } catch (err) {
      console.error('Failed to parse AI response:', err);
      return res.status(500).json({ message: 'AI returned invalid JSON', aiText });
    }

    
    for (const day of activities) {
      const enrichedPlans = await Promise.all(
  day.plans.map(async (plan) => {
    try {
      const coords = await getCoordinates(plan.location);
      const [weather, imageUrl] = await Promise.all([
        getWeather(coords.lat, coords.lng, startDate),
        getPhoto(plan.location),
      ]);

      return {
        ...plan,
        lat: coords.lat,
        lng: coords.lng,
        weather,
        imageUrl,
      };
    } catch (err) {
      console.warn(`Failed to enrich activity "${plan.activity}":`, err);
      return plan; 
    }
  })
);

      day.plans = enrichedPlans;
    }

    const itinerary = new Itinerary({
      destination,
      travelDates: { start: new Date(startDate), end: new Date(endDate) },
      interests: interestsArray,
      activities,
    });

    await itinerary.save();
    console.log('Itinerary saved successfully');

    res.status(201).json(itinerary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      message: 'Error generating itinerary',
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default router;
