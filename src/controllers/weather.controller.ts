// src/controllers/weather.controller.ts
import { Request, Response } from 'express';

export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // TODO: Integrate real weather API (e.g., WeatherAPI.com)
    // TODO: add 404 for city not found
    const mockWeather = {
      temperature: 20,
      humidity: 60,
      description: 'Partly cloudy',
    };

    return res.status(200).json(mockWeather);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather' });
  }
};
