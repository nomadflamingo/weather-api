import axios from 'axios';
import { Weather } from '@models/weather.model';
import { WeatherAPIErrorResponse, WeatherAPIResponse } from '@models/weatherapi-response.model';
import { ExternalApiError } from '@lib/errors/external-api-error';

export const getWeatherForCity = async (city: string): Promise<Weather> => {
  const baseUrl = process.env.WEATHER_API_URL;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('Missing WEATHER_API_URL or WEATHER_API_KEY in environment');
  }

  try {
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as WeatherAPIErrorResponse | undefined;

      const message =
        data?.error?.message ?? 'Failed to fetch weather from WeatherAPI';
      const statusCode = error.response?.status || 500;

      console.error('WeatherAPI error:', data);

      throw new ExternalApiError(statusCode, message);
    } else if (error instanceof Error) {
      console.error('Generic error:', error.message);
      throw error;
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unknown error occurred while fetching weather');
    }
  }
};
