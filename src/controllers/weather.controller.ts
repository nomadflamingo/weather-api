// src/controllers/weather.controller.ts
import { Request, Response } from 'express';
import { getWeatherForCity } from '@services/weather.service';


export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const weather = await getWeatherForCity(city);
  return res.status(200).json(weather);
};
