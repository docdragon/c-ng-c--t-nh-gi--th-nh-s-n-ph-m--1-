import { useState, useEffect, useCallback } from 'react';
import type { AllMaterials } from '../types';

const useMaterials = () => {
  const [materialsData, setMaterialsData] = useState<AllMaterials | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/materials');
      if (!response.ok) {
        throw new Error(`Lỗi mạng: ${response.statusText}`);
      }
      const data: AllMaterials = await response.json();
      setMaterialsData(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu vật tư.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { materialsData, isLoading, error, refetch: fetchData };
};

export default useMaterials;
