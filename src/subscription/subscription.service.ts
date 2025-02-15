import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherService } from '../weather/weather.service';
import { BotService } from '../bot/bot.service';

@Injectable()
export class SubscriptionService {
  private subscribers: string[] = [];

  constructor(
    private readonly weatherService: WeatherService,
    private readonly botService: BotService,
  ) {}

  addSubscriber(chatId: string) {
    if (!this.subscribers.includes(chatId)) {
      this.subscribers.push(chatId);
    }
  }

  removeSubscriber(chatId: string) {
    this.subscribers = this.subscribers.filter((id) => id !== chatId);
  }

  getSubscribers(): string[] {
    return this.subscribers;
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyWeatherUpdates() {
    for (const chatId of this.subscribers) {
      const weather = await this.weatherService.getWeather('London'); // Replace with user's city
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.botService.sendMessage(chatId, weather);
    }
  }
}
