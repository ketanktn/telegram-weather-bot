import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { WeatherService } from '../weather/weather.service';
import { Cron } from '@nestjs/schedule';
import natural from 'natural'; // Import the natural library

interface SubscribedUser {
  city: string;
  chatId: number;
}

@Injectable()
export class BotService implements OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendMessage(chatId: string, weather: string) {
    throw new Error('Method not implemented.');
  }
  private bot: Telegraf;
  private readonly logger = new Logger(BotService.name);
  private tokenizer: natural.WordTokenizer; // Add tokenizer for NLP

  constructor(
    private configService: ConfigService,
    private weatherService: WeatherService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    this.bot = new Telegraf(token);
    this.tokenizer = new natural.WordTokenizer(); // Initialize the tokenizer

    // Start command
    this.bot.start((ctx) => ctx.reply('Welcome to the Weather Bot By Ketan!'));

    // Weather command
    this.bot.command('weather', async (ctx) => {
      const city = ctx.message.text.split(' ')[1];
      if (!city) {
        return ctx.reply('Please provide a city name.');
      }
      try {
        const weather = await this.weatherService.getWeather(city);
        await ctx.reply(weather);
      } catch (err) {
        this.logger.error('Error getting weather:', err);
        await ctx.reply('Sorry, something went wrong. Please try again later.');
      }
    });

    // Natural Language Processing (NLP) for weather queries
    this.bot.on('text', async (ctx) => {
      const userMessage = ctx.message.text.toLowerCase();
      const tokens = this.tokenizer.tokenize(userMessage);

      if (tokens.includes('weather') && tokens.includes('in')) {
        const cityIndex = tokens.indexOf('in') + 1;
        const city = tokens[cityIndex];
        try {
          const weather = await this.weatherService.getWeather(city);
          await ctx.reply(weather);
        } catch (err) {
          this.logger.error('Error getting weather:', err);
          await ctx.reply(
            'Sorry, something went wrong. Please try again later.',
          );
        }
      } else {
        // If the message doesn't match the NLP pattern, ignore it
        // (or you can add a default response like "I didn't understand that.")
      }
    });

    // Launch the bot
    this.bot
      .launch()
      .then(() => {
        this.logger.log('Bot started successfully');
      })
      .catch((err) => {
        this.logger.error('Bot launch failed:', err);
      });
  }

  onModuleInit() {
    this.logger.log('BotService initialized');
  }

  // Cron job to send daily weather update at 8 AM
  @Cron('0 8 * * *')
  async sendDailyWeatherUpdate() {
    // Fetch subscribed users from a database (replace this with actual database logic)
    const subscribedUsers: SubscribedUser[] = [
      { city: 'New York', chatId: 123456789 },
      { city: 'London', chatId: 987654321 },
    ];

    for (const user of subscribedUsers) {
      try {
        const weather = await this.weatherService.getWeather(user.city);
        if (this.bot && this.bot.telegram) {
          await this.bot.telegram.sendMessage(user.chatId, weather);
        } else {
          this.logger.error('Bot or telegram object is undefined');
        }
      } catch (err) {
        this.logger.error(
          `Failed to send weather update to user ${user.chatId}:`,
          err,
        );
      }
    }
  }
}
