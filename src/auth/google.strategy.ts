import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

// Define the structure of the Google profile
interface GoogleProfile {
  emails: { value: string }[];
  name: { givenName: string; familyName: string };
  photos: { value: string }[];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): void {
    try {
      this.logger.log(`
        Validating user with profile: ${JSON.stringify(profile)}`);

      const { name, emails, photos } = profile;

      // Validate required fields
      if (!emails || !emails[0] || !name || !photos || !photos[0]) {
        throw new Error('Invalid profile data');
      }

      // Construct the user object
      const user = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken,
      };

      this.logger.log(`User validated successfully: ${JSON.stringify(user)}`);

      // Call the done callback with the user object
      //@ts-expected-error
    } catch (error: unknown) {
      this.logger.error(`Error during validation:`);

      // Call the done callback with the error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      done(error as Error, null);
    }
  }
}
