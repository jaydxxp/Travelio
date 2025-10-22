import express from 'express';
import { getWeather, IWeather } from '../utils/weatherbit';
import { getCoordinates, ICoordinates } from '../utils/mapbox';
import { getPhoto } from '../utils/unsplash';

const router = express.Router();


router.get('/enrich', async (req, res) => {
  try {
    const { place, date } = req.query;

    if (!place || typeof place !== 'string')
      return res.status(400).json({ message: 'Place is required' });
    if (!date || typeof date !== 'string')
      return res.status(400).json({ message: 'Date is required' });

  
    const coords: ICoordinates = await getCoordinates(place);


    const weather: IWeather = await getWeather(coords.lat, coords.lng, date);

   
    const imageUrl: string = await getPhoto(place);


    const enrichedData = {
      location: place,
      coords,
      weather,
      imageUrl,
    };

    res.json(enrichedData);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Enrichment failed', error: error.message || error });
  }
});

export default router;
