import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy'; // Add JwtStrategy
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; // Add AuthService

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Set default strategy to JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Load JWT secret from .env
        signOptions: { expiresIn: '1h' }, // Token expiration time
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GoogleStrategy, JwtStrategy, AuthService], // Add JwtStrategy and AuthService
  controllers: [AuthController],
  exports: [JwtModule, PassportModule], // Export JwtModule and PassportModule for use in other modules
})
export class AuthModule {}
