import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { fetchPointChangeHistory } from '../../utils/api';  // Import the helper function

interface PointHistoryEntry {
  change_date: string;
  points_changed: number;
  reason: string;
}

const PointHistory: React.FC<{ driverUsername: string }> = ({ driverUsername }) => {
  const [history, setHistory] = useState<PointHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPointHistory = async () => {
      const pointHistory = await fetchPointChangeHistory(driverUsername);
      if (pointHistory) {
        setHistory(pointHistory);
        setError(null);
      } else {
        setError("Failed to load point history.");
      }
    };

    loadPointHistory();
  }, [driverUsername]);

  const handleGenerateReport = () => {
    // Logic for generating the report can go here
    console.log("Generate report button clicked");
  };
  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h6">Point Change History for {driverUsername}</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGenerateReport} 
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Generate Report
      </Button>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3} sx={{ overflow: 'auto', marginTop: '16px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Points Changed</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(entry.change_date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.points_changed}</TableCell>
                  <TableCell>{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default PointHistory;
