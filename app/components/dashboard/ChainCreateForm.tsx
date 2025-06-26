'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';

const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/';

interface Chain {
  id: string;
  name: string;
  description: string;
}

const SuperAdminDashboard: React.FC = () => {
  const router = useRouter();
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const token = 'your-token'; // Replace with real auth token or hook

  useEffect(() => {
    const fetchChains = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/chains`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChains(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch chains');
        } else {
          setError('Failed to fetch chains');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChains();
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Super Admin Dashboard</h1>

      <Button
        variant="outlined"
        onClick={() => router.push('/super-admin/chains/create')}
        style={{ marginBottom: 20 }}
      >
        <Plus style={{ marginRight: 8 }} />
        Add New Chain
      </Button>

      {loading && <p>Loading chains...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {chains.map((chain) => (
          <li key={chain.id}>
            <strong>{chain.name}</strong> - {chain.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminDashboard;
