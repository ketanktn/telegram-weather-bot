import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { WeatherModule } from '../weather/weather.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [WeatherModule, BotModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
