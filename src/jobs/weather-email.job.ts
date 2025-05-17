import cron from 'node-cron';
import { getAllConfirmedSubscriptions } from '@services/subscription.service';
import { getWeatherForCity } from '@services/weather.service';
import { sendWeatherUpdateEmail } from '@services/mail.service';
import { buildUnsubscribeUrl } from '@lib/url';

/**
 * Runs every hour. Filters hourly and daily subscriptions and sends weather updates.
 */
export const startWeatherEmailJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running weather email job...');

    const subscriptions = await getAllConfirmedSubscriptions();

    const now = new Date();
    const hour = now.getHours();

    for (const sub of subscriptions) {
      // Skip daily emails unless it's 08:00 AM
      if (sub.frequency === 'daily' && hour !== 8) continue;

      const weather = await getWeatherForCity(sub.city);

      const unsubscribeUrl = buildUnsubscribeUrl(sub.token);
      await sendWeatherUpdateEmail(sub.email, sub.city, weather, unsubscribeUrl);
    }
  });
};
