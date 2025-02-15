import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// Define the structure of the user object returned by Google OAuth2
interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

// Extend Express Request to include the user property
interface AuthenticatedRequest extends Request {
  user?: GoogleUser;
}

@Controller('admin')
export class AdminController {
  // Example in-memory storage for blocked users (replace with a database in production)
  private blockedUsers: Set<number> = new Set();

  // Route to display the admin panel
  @Get()
  @UseGuards(AuthGuard('google'))
  getAdminPanel(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }

    // Return JSON response
    return {
      message: 'Welcome to the Admin Panel',
      user: req.user,
    };
  }

  // Route to block a user
  @Post('block-user')
  @UseGuards(AuthGuard('google'))
  blockUser(@Body('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Add the user to the blocked list
    this.blockedUsers.add(userId);

    // Return JSON response
    return {
      message: 'User blocked successfully',
      userId,
    };
  }

  // Route to unblock a user
  @Post('unblock-user')
  @UseGuards(AuthGuard('google'))
  unblockUser(@Body('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Remove the user from the blocked list
    this.blockedUsers.delete(userId);

    // Return JSON response
    return {
      message: 'User unblocked successfully',
      userId,
    };
  }

  // Route to update bot settings (e.g., API keys)
  @Post('update-settings')
  @UseGuards(AuthGuard('google'))
  updateSettings(@Body() settings: { apiKey: string }) {
    if (!settings.apiKey) {
      throw new BadRequestException('API key is required');
    }

    // Update the bot settings (replace with actual logic)
    return {
      message: 'Settings updated successfully',
      settings,
    };
  }
}
