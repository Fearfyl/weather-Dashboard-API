import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data

  router.post('/', async (req, res) => {
    const { city } = req.body;
  
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    try {
      const weatherData = await WeatherService.getWeatherForCity(city);
      await HistoryService.addCity(city);
      return res.json(weatherData);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
  });

  router.get('/:city', async (req, res) => {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    try {
      const weatherData = await WeatherService.getWeatherForCity(city);
      await HistoryService.getCities();
      return res.json(weatherData);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
  });
  // TODO: GET weather data from city name
  // TODO: save city to search history


// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await HistoryService.removeCitybyId(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
