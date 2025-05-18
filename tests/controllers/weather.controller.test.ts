import { getWeather } from '@controllers/weather.controller';
import { getWeatherForCity } from '@services/weather.service';
import { ExternalApiError } from '@lib/errors/external-api-error';
import { Request, Response } from 'express';

jest.mock('@services/weather.service');

const mockedGetWeatherForCity = getWeatherForCity as jest.Mock;

describe('getWeather controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = {};
    res = { status };
  });

  it('should return 400 if city is not provided', async () => {
    req.query = {};
    await getWeather(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'City is required' });
  });

  it('should return weather data for a valid city', async () => {
    req.query = { city: 'Kyiv' };
    const mockWeather = {
      temperature: 20,
      humidity: 60,
      description: 'Clear',
    };
    mockedGetWeatherForCity.mockResolvedValueOnce(mockWeather);

    await getWeather(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(mockWeather);
  });

  it('should throw ExternalApiError(404) for city not found (code 1006)', async () => {
    req.query = { city: 'InvalidCity' };

    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: {
            code: 1006,
            message: 'No matching location found',
          },
        },
      },
    };

    mockedGetWeatherForCity.mockRejectedValueOnce(axiosError);

    try {
      await getWeather(req as Request, res as Response);
    } catch (err) {
      expect(err).toBeInstanceOf(ExternalApiError);
      expect((err as ExternalApiError).statusCode).toBe(404);
      expect((err as ExternalApiError).message).toBe('City not found');
    }
  });

  it('should throw ExternalApiError for other weather API failures', async () => {
    req.query = { city: 'SomeCity' };

    const axiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          error: {
            code: 2006,
            message: 'API key is invalid',
          },
        },
      },
    };

    mockedGetWeatherForCity.mockRejectedValueOnce(axiosError);

    try {
      await getWeather(req as Request, res as Response);
    } catch (err) {
      expect(err).toBeInstanceOf(ExternalApiError);
      expect((err as ExternalApiError).statusCode).toBe(500);
      expect((err as ExternalApiError).message).toBe('API key is invalid');
    }
  });

  it('should throw generic error for unknown failure', async () => {
    req.query = { city: 'SomeCity' };

    mockedGetWeatherForCity.mockRejectedValueOnce(new Error('something went wrong'));

    await expect(getWeather(req as Request, res as Response)).rejects.toThrow(
      'Unknown error occurred while fetching weather'
    );
  });
});
