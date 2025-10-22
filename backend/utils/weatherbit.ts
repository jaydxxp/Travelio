import fetch from 'node-fetch';

const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;

export interface IWeather {
  date: string;
  temp: number;
  description: string;
  icon: string;
}


interface IWeatherbitDaily {
  valid_date: string;
  temp: number;
  weather: { description: string; icon: string };
}


interface IWeatherbitResponse {
  data: IWeatherbitDaily[];
}

export async function getWeather(lat: number, lon: number, date: string): Promise<IWeather> {
  if (!WEATHERBIT_API_KEY) throw new Error('Weatherbit API key is missing');

  const response = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=16&key=${WEATHERBIT_API_KEY}`
  );

  const data = (await response.json()) as IWeatherbitResponse;

  const firstDate = new Date(data.data[0].valid_date).setHours(0, 0, 0, 0);
const lastDate = new Date(data.data[data.data.length - 1].valid_date).setHours(0, 0, 0, 0);
const targetDateNum = new Date(date).setHours(0, 0, 0, 0);

if (targetDateNum < firstDate || targetDateNum > lastDate) {
  return {
    date,
    temp: 25,
    description: 'Forecast not available (date outside free-tier limit)',
    icon: '',
  };
}


  const targetDate = new Date(date).setHours(0, 0, 0, 0);
  const forecast = data.data.find(
    (d) => new Date(d.valid_date).setHours(0, 0, 0, 0) === targetDate
  );

  if (!forecast) {
    return {
      date,
      temp: 25,
      description: 'No forecast data for this date',
      icon: '',
    };
  }

  return {
    date,
    temp: forecast.temp,
    description: forecast.weather.description,
    icon: `https://www.weatherbit.io/static/img/icons/${forecast.weather.icon}.png`,
  };
}
