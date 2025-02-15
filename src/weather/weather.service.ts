import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Define the correct response structure for WeatherAPI.com
interface WeatherResponse {
  location: {
    name: string; // City name
  };
  current: {
    temp_c: number; // Temperature in Celsius
    condition: {
      text: string; // Weather condition (e.g., "Sunny", "Partly cloudy")
    };
  };
}

@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getWeather(city: string): Promise<string> {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
      // Fetch weather data from WeatherAPI.com
      const response = await firstValueFrom(
        this.httpService.get<WeatherResponse>(url),
      );

      // Extract relevant data from the response
      const location = response.data.location.name;
      const condition = response.data.current.condition.text;
      const temperature = response.data.current.temp_c;

      // Format the weather message
      return `Weather in ${location}: ${condition}, Temperature: ${temperature}°C`;
    } catch (error) {
      // Log the error for debugging
      if (error instanceof Error) {
        console.error('Error fetching weather data:', error.message);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        // Handle Axios errors (e.g., network issues, invalid API key)
        const axiosError = error as { response?: { data?: any } };
        console.error(
          'Error response from WeatherAPI:',
          axiosError.response?.data,
        );
      } else {
        console.error('Unknown error:', error);
      }

      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
}
