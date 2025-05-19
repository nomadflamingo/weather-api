import express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from '@routes/weather.routes';
import subscriptionRoutes from '@routes/subscription.routes';
import { errorHandler } from '@middlewares/error.middleware';
import { startWeatherEmailJob } from '@jobs/weather-email.job';
import { rateLimiter } from '@middlewares/rate-limiter.middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

// Redirect root to API docs
app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

// Rate Limiter
if (process.env.NODE_ENV === 'production') {
  app.use(rateLimiter);
}

// Main Routes
app.use('/api/weather', weatherRoutes);
app.use('/api', subscriptionRoutes); // subscribe, confirm, unsubscribe

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  startWeatherEmailJob();
});