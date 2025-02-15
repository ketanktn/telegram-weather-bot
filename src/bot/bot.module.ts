import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotService } from './bot.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [ConfigModule.forRoot(), WeatherModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
