import { useState, useEffect, useCallback } from 'react';
import { amoService } from '../services/amoService';

export interface OperatorStat {
  name: string;
  talkedCount: number;
  tasksCount: number;
  sentToDealerCount: number;
  totalAssignedCount: number;
}

export interface DealerStat {
  name: string;
  count: number;
}

export interface DashboardData {
  operators: OperatorStat[];
  cumulativeDealers: DealerStat[];
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await amoService.getDashboardData();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      const errorData = err.response?.data;
      const msg = errorData?.error || errorData?.details || err.message || 'Маълумотларни юклашда хатолик юз берди.';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refetch: fetchData };
};
