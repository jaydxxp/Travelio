import fetch from 'node-fetch';

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

export interface ICoordinates {
  lat: number;
  lng: number;
}

interface IMapboxFeature {
  center: [number, number];
}

interface IMapboxResponse {
  features: IMapboxFeature[];
}

export async function getCoordinates(place: string): Promise<ICoordinates> {
  if (!MAPBOX_API_KEY) throw new Error('MAPBOX_API_KEY not set');

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    place
  )}.json?access_token=${MAPBOX_API_KEY}&limit=1`;

  const response = await fetch(url);
  const data = (await response.json()) as IMapboxResponse;

  if (!data.features || data.features.length === 0)
    throw new Error('Location not found');

  return {
    lat: data.features[0].center[1],
    lng: data.features[0].center[0],
  };
}
