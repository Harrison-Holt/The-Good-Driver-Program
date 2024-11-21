import React, { useState, useEffect } from 'react';
import { selectUserName } from "../../store/userSlice";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, CircularProgress } from '@mui/material';
import { fetchSponsorDrivers, fetchUserInfo, DriverInfo } from '../../utils/api';
import { useAppSelector } from "../../store/hooks";

const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the logged-in username from the Redux store
  const username = useAppSelector(selectUserName);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        if (!username) {
          setError('User is not logged in or username is missing.');
          setLoading(false);
          return;
        }

        // Fetch user info to get sponsor_org_id
        const userInfo = await fetchUserInfo(username);
        console.log('User Info:', userInfo); // Debugging: Check what userInfo contains

        if (userInfo && userInfo.sponsor_org_id) {
          // Use sponsor_org_id to fetch drivers
          const sponsorOrgId = userInfo.sponsor_org_id.toString();
          console.log('Sponsor Org ID:', sponsorOrgId); // Debugging: Ensure sponsorOrgId is correct

          const driverList = await fetchSponsorDrivers(sponsorOrgId);

          if (driverList) {
            setDrivers(driverList);
          } else {
            setError('No drivers found.');
          }
        } else {
          setError('Sponsor organization not found.');
        }
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to fetch drivers.');
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
  }, [username]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Driver List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.username}>
              <TableCell>{driver.username}</TableCell>
              <TableCell>{driver.first_name}</TableCell>
              <TableCell>{driver.last_name}</TableCell>
              <TableCell>{driver.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DriverList;
