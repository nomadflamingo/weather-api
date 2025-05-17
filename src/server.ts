import express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from '@routes/weather.routes';
import subscriptionRoutes from '@routes/subscription.routes';
import { errorHandler } from '@middlewares/error.middleware';
import { startWeatherEmailJob } from '@jobs/weather-email.job';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api', subscriptionRoutes); // subscribe, confirm, unsubscribe

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  startWeatherEmailJob();
});