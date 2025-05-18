import axios from 'axios';
import { Weather } from '@models/weather.model';
import { WeatherAPIResponse } from '@models/weatherapi-response.model';

export const getWeatherForCity = async (city: string): Promise<Weather> => {
  const baseUrl = process.env.WEATHER_API_URL;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('Missing WEATHER_API_URL or WEATHER_API_KEY in environment');
  }

  const response = await axios.get<WeatherAPIResponse>(baseUrl, {
    params: {
      key: apiKey,
      q: city,
      aqi: 'no',
    },
  });

  const data = response.data;

  const weather: Weather = {
    temperature: data.current.temp_c,
    humidity: data.current.humidity,
    description: data.current.condition.text,
  };

  return weather;
};
