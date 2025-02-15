import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service'; // Add AdminService
import { JwtModule } from '@nestjs/jwt'; // Add JwtModule
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add ConfigModule and ConfigService

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService], // Add AdminService
})
export class AdminModule {}
