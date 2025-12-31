// Estate API Service
// Fetches estates from backend

import { Estate } from '@/types/publicTypes';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.18.3:4000/api';

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
      console.log('🔍 Fetching estates from:', `${API_BASE_URL}/estates/all`);
      
      const response = await fetch(`${API_BASE_URL}/estates/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Response status:', response.status);
      console.log('✅ Response ok:', response.ok);
      
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Response not OK:', data);
        return {
          success: false,
          error: data.message || 'Failed to fetch estates',
        };
      }

      console.log('✅ Estates fetched successfully:', data);
      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      console.error('❌ Get Estates Error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ API URL was:', API_BASE_URL);
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

