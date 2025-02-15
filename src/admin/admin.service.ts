import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  // Example in-memory storage for blocked users (replace with a database in production)
  private blockedUsers: Set<number> = new Set();

  constructor(private jwtService: JwtService) {}

  // Method to get admin dashboard data
  getDashboardData(user: any) {
    return {
      message: 'Welcome to the Admin Dashboard',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user,
    };
  }

  // Method to block a user
  blockUser(userId: number) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Add the user to the blocked list
    this.blockedUsers.add(userId);

    return {
      message: 'User blocked successfully',
      userId,
    };
  }

  // Method to unblock a user
  unblockUser(userId: number) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Remove the user from the blocked list
    this.blockedUsers.delete(userId);

    return {
      message: 'User unblocked successfully',
      userId,
    };
  }

  // Method to update bot settings (e.g., API keys)
  updateSettings(settings: { apiKey: string }) {
    if (!settings.apiKey) {
      throw new Error('API key is required');
    }

    // Update the bot settings (replace with actual logic)
    return {
      message: 'Settings updated successfully',
      settings,
    };
  }

  // Method to handle Google OAuth login
  googleLogin(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!req.user) {
      return { message: 'No user from Google' };
    }

    // Generate a JWT token for the user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload = { email: req.user.email, sub: req.user.accessToken };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Google login successful',
      access_token: accessToken,
    };
  }
}
