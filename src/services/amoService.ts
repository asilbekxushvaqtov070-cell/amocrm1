import axios from 'axios';
import { mockOperators, mockDealers, OperatorStats, DealerStats } from '../utils/mockData';

export const amoService = {
  getDashboardData: async (): Promise<{ operators: OperatorStats[], cumulativeDealers: DealerStats[] }> => {
    try {
      const response = await axios.get('/api/amocrm/stats');
      return response.data;
    } catch (error: any) {
      // If error is 400 or 500, fallback to mock data for demo
      if (error.response?.status === 400 || error.response?.status === 500) {
        console.warn('Backend error. Falling back to mock data.');
        return {
          operators: mockOperators,
          cumulativeDealers: mockDealers,
        };
      }
      console.error('Error fetching dashboard stats from backend:', error);
      throw error;
    }
  },
};
