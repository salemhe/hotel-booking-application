'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress, 
  Alert, 
  Snackbar 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/';

const useAuth = () => {
  return {
    user: null,
    token: 'your-token',
  };
};

interface ChainData {
  name: string;
  description: string;
  owner: string;
  contactEmail: string;
  contactPhone: string;
  logo: string;
}

export default function EditChainPage() {
  const params = useParams();
  const chainId = params.id as string;
  const { token } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<ChainData>({
    name: '',
    description: '',
    owner: '',
    contactEmail: '',
    contactPhone: '',
    logo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchingChain, setFetchingChain] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchChainDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/chains/${chainId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setFormData(response.data.data);
      } catch (error) {
        console.error('Error fetching chain details:', error);
      } finally {
        setFetchingChain(false);
      }
    };

    fetchChainDetails();
  }, [chainId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.put(`${API_URL}/chains/${chainId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/super-admin/dashboard');
      }, 2000);
    } catch (error: unknown) {
      console.error('Error updating chain:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to update chain');
      } else {
        setError('Failed to update chain');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingChain) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Edit Chain</Typography>
        <Button 
          variant="outlined" 
          onClick={() => router.push('/super-admin/dashboard')}
        >
          Cancel
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Chain Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Owner Name"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
              />
              
              <TextField
                required
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                label="Logo URL"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Chain'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Chain updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}