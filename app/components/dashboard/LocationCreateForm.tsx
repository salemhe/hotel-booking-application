import React, { useState, useEffect } from 'react';
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
import { apiFetcher } from "@/app/lib/fetcher";


const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/';

const useAuth = () => {
  return {
    user: null,
    token: 'your-token',
    login: () => {},
    logout: () => {}
  };
};

interface Chain {
  id: string;
  name: string;
}

interface FormData {
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

const LocationCreateForm: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  
  const [chains, setChains] = useState<Chain[]>([]);
  const [formData, setFormData] = useState<FormData>({
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
  
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingChains, setFetchingChains] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const data = await apiFetcher(`${API_URL}/super-admin/chains`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChains(data.data || []);
      } catch (error) {
        console.error('Error fetching chains:', error);
      } finally {
        setFetchingChains(false);
      }
    };

    fetchChains();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiFetcher(`${API_URL}/locations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/super-admin/dashboard');
      }, 2000);
    } catch (error: unknown) {
      console.error('Error creating location:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to create location');
      } else {
        setError('Failed to create location');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Create New Location</Typography>
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
                onChange={(e) => setFormData(prev => ({ ...prev, chainId: e.target.value }))}
                label="Chain"
                disabled={fetchingChains}
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
              {fetchingChains && (
                <FormHelperText>Loading chains...</FormHelperText>
              )}
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
                {loading ? <CircularProgress size={24} /> : 'Create Location'}
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
          Location created successfully!
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
};

export default LocationCreateForm;