// src/controllers/weather.controller.ts
import { Request, Response } from 'express';
import { getWeatherForCity } from '@services/weather.service';

export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // TODO: Integrate real weather API (e.g., WeatherAPI.com)
    // TODO: add 404 for city not found
    const weather = await getWeatherForCity(city);

    return res.status(200).json(weather);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather' });
  }
};
