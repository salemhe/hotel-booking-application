'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Tab, 
  Tabs, 
  CircularProgress, 
  Divider, 
  Paper 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';

// Define API_URL
const API_URL = 'https://hotel-booking-app-backend-30q1.onrender.com/api/';

interface Vendor {
  id: string;
  name: string;
  type: string;
  chain?: {
    name: string;
  };
  location?: {
    address: string;
    city: string;
  };
  contact?: string;
  owner?: {
    name: string;
  };
  totalRevenue?: number;
  totalBookings?: number;
  activeBookings?: number;
  status?: string;
  createdAt: string;
  monthlyAverage?: number;
  platformFee?: number;
  monthlyRevenue?: { month: string; revenue: number }[];
  totalRooms?: number;
  availableRooms?: number;
  totalTables?: number;
  availableTables?: number;
}

const VendorDetailView = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const vendorId = params.id as string;
  const vendorType = searchParams.get('vendorType');
  const { token, user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'super-admin') {
      router.push('/dashboard'); // Redirect non-super-admins
      return;
    }
  }, [isAuthenticated, user, router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!vendorId || !vendorType) {
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/super-admin/analytics/vendor/${vendorId}?vendorType=${vendorType}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setVendor(response.data.data);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId, vendorType, token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Vendor not found</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }} 
          onClick={() => router.push('/super-admin/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {vendor.name} ({vendor.type === 'hotel' ? 'Hotel' : 'Restaurant'})
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/super-admin/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Financial" />
          <Tab label="Reservations" />
          {vendor.type === 'hotel' && <Tab label="Rooms" />}
          {vendor.type === 'restaurant' && <Tab label="Tables" />}
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Vendor Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><strong>ID:</strong> {vendor.id}</Typography>
                  <Typography><strong>Name:</strong> {vendor.name}</Typography>
                  <Typography><strong>Type:</strong> {vendor.type === 'hotel' ? 'Hotel' : 'Restaurant'}</Typography>
                  <Typography><strong>Chain:</strong> {vendor.chain?.name || 'Independent'}</Typography>
                  <Typography><strong>Location:</strong> {vendor.location?.address}, {vendor.location?.city}</Typography>
                  <Typography><strong>Contact:</strong> {vendor.contact || 'N/A'}</Typography>
                  <Typography><strong>Owner:</strong> {vendor.owner?.name || 'N/A'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><strong>Total Revenue:</strong> ${vendor.totalRevenue?.toFixed(2) || '0.00'}</Typography>
                  <Typography><strong>Total Bookings:</strong> {vendor.totalBookings || 0}</Typography>
                  <Typography><strong>Active Bookings:</strong> {vendor.activeBookings || 0}</Typography>
                  <Typography><strong>Status:</strong> {vendor.status || 'Active'}</Typography>
                  <Typography><strong>Joined:</strong> {new Date(vendor.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Financial Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Financial Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            <Card sx={{ flex: '1 1 30%', minWidth: '200px' }}>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">${vendor.totalRevenue?.toFixed(2) || '0.00'}</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ flex: '1 1 30%', minWidth: '200px' }}>
              <CardContent>
                <Typography variant="h6">Monthly Average</Typography>
                <Typography variant="h4">${vendor.monthlyAverage?.toFixed(2) || '0.00'}</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ flex: '1 1 30%', minWidth: '200px' }}>
              <CardContent>
                <Typography variant="h6">Platform Fee</Typography>
                <Typography variant="h4">${vendor.platformFee?.toFixed(2) || '0.00'}</Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Monthly Breakdown</Typography>
            {(vendor.monthlyRevenue && vendor.monthlyRevenue.length > 0) ? (
              <Box>
                {/* Add monthly revenue chart or table here */}
                <Typography variant="body2">Monthly financial data available</Typography>
              </Box>
            ) : (
              <Typography>No monthly data available</Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* Reservations Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Reservation Management</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              Total Reservations: {vendor.totalBookings || 0}
            </Typography>
            <Typography variant="body1">
              Active Reservations: {vendor.activeBookings || 0}
            </Typography>
          </Box>
          
          {/* Add recent bookings table here */}
          <Typography>No recent reservations found</Typography>
        </Paper>
      )}

      {/* Rooms Tab (Hotel only) */}
      {tabValue === 3 && vendor.type === 'hotel' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Room Management</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              Total Rooms: {vendor.totalRooms || 0}
            </Typography>
            <Typography variant="body1">
              Available Rooms: {vendor.availableRooms || 0}
            </Typography>
          </Box>
          
          {/* Add room details here */}
          <Typography>Room details not available</Typography>
        </Paper>
      )}

      {/* Tables Tab (Restaurant only) */}
      {tabValue === 3 && vendor.type === 'restaurant' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Table Management</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              Total Tables: {vendor.totalTables || 0}
            </Typography>
            <Typography variant="body1">
              Available Tables: {vendor.availableTables || 0}
            </Typography>
          </Box>
          
          {/* Add table details here */}
          <Typography>Table details not available</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VendorDetailView;