// Backend Auth API Service
// Communicates with HMB backend after Firebase authentication

import { CreateUserDto, UpdateUserDto } from '@/types/publicDTOTypes';
import { User } from '@/types/publicTypes';
import { Role } from '@/types/publicenums';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.18.3:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const AuthApiService = {
  /**
   * Create or sync user in backend after Firebase registration
   * Uses Firebase ID token as Bearer token
   */
  async createUser(
    userData: CreateUserDto,
    firebaseToken: string
  ): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to create user',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('Create User Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get user profile from backend
   * Called after Firebase login to sync user data
   */
  async getUserProfile(firebaseToken: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to get user profile',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('Get User Profile Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },

  /**
   * Update user profile in backend
   */
  async updateUser(
    userId: number,
    userData: UpdateUserDto,
    firebaseToken: string
  ): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Failed to update user',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('Update User Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },

  /**
   * Verify Firebase token with backend
   * Backend should validate the token and return user data
   */
  async verifyToken(firebaseToken: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Token verification failed',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('Verify Token Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },
};

export default AuthApiService;

