import express from 'express';
import { getWeather } from '@controllers/weather.controller';

const router = express.Router();

// GET /api/weather?city=Kyiv
router.get('/', getWeather);

export default router;
