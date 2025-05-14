import express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from '@routes/weather.routes';
import subscriptionRoutes from '@routes/subscription.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api', subscriptionRoutes); // subscribe, confirm, unsubscribe

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});