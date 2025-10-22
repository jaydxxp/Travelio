import fetch from 'node-fetch';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface IUnsplashPhoto {
  urls: { small: string };
}

interface IUnsplashResponse {
  results: IUnsplashPhoto[];
}

export async function getPhoto(query: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) throw new Error('UNSPLASH_ACCESS_KEY not set');

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;

  const response = await fetch(url);
  const data = (await response.json()) as IUnsplashResponse;

  if (!data.results || data.results.length === 0)
    return '';

  return data.results[0].urls.small;
}
