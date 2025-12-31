// Estate API Service
// Fetches estates from backend

import { Estate } from '@/types/publicTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.18.5:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const EstateService = {
  /**
   * Get all estates
   * Public endpoint - no auth required for signup
   */
  async getEstates(): Promise<ApiResponse<Estate[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/estates/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Response not OK:', data);
        return {
          success: false,
          error: data.message || 'Failed to fetch estates',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      console.error('❌ Get Estates Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },

  /**
   * Get estate by ID
   */
  async getEstateById(id: number): Promise<ApiResponse<Estate>> {
    try {
      const response = await fetch(`${API_BASE_URL}/estates/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to fetch estate',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('Get Estate Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },
};

export default EstateService;

