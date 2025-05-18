// src/controllers/weather.controller.ts
import { Request, Response } from 'express';
import { getWeatherForCity } from '@services/weather.service';
import axios from 'axios';
import { ExternalApiError } from '@lib/errors/external-api-error';
import { WeatherAPIErrorResponse } from '@models/weatherapi-response.model';


export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    res.status(400).json({ error: 'City is required' });
    return;
  }

  try {
    const weather = await getWeatherForCity(city);
    res.status(200).json(weather);
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as WeatherAPIErrorResponse | undefined;

      if (data?.error.code === 1006) {
        throw new ExternalApiError(404, 'City not found');
      }

      const message = data?.error?.message ?? 'Failed to fetch weather from WeatherAPI';
      const statusCode = error.response?.status || 500;

      throw new ExternalApiError(statusCode, message);
    }

    throw new Error('Unknown error occurred while fetching weather');
  }
};
