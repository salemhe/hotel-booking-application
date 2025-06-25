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
  Snackbar, 
  MenuItem, 
  Select,
  FormControl, 
  InputLabel, 
  FormHelperText 
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

interface Chain {
  id: string;
  name: string;
}

interface LocationData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  chainId: string;
}

export default function EditLocationPage() {
  const params = useParams();
  const locationId = params.id as string;
  const { token } = useAuth();
  const router = useRouter();
  
  const [chains, setChains] = useState<Chain[]>([]);
  const [formData, setFormData] = useState<LocationData>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    chainId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chains and location data in parallel
        const [chainsRes, locationRes] = await Promise.all([
          axios.get(`${API_URL}/super-admin/chains`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/locations/${locationId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setChains(chainsRes.data.data || []);
        setFormData(locationRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [locationId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.put(`${API_URL}/locations/${locationId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/super-admin/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error updating location:', error);
      setError(error.response?.data?.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Edit Location</Typography>
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
            {/* Name Field */}
            <TextField
              required
              fullWidth
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            
            {/* Address Field */}
            <TextField
              required
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            
            {/* City, State, Country Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Box>
            
            {/* Postal Code, Latitude, Longitude Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., 40.7128"
              />
              
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., -74.0060"
              />
            </Box>
            
            {/* Chain Selector */}
            <FormControl fullWidth>
              <InputLabel id="chain-select-label">Chain</InputLabel>
              <Select
                labelId="chain-select-label"
                id="chainId"
                name="chainId"
                value={formData.chainId}
                onChange={handleChange}
                label="Chain"
              >
                <MenuItem value="">
                  <em>None (Independent Location)</em>
                </MenuItem>
                {chains.map(chain => (
                  <MenuItem key={chain.id} value={chain.id}>
                    {chain.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Location'}
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
          Location updated successfully!
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