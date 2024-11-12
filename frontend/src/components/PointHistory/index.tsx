import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';
import { fetchPointChangeHistory } from '../../utils/api';  // Import the helper function
// Allows pdf generation
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Point Change History for ${driverUsername}`, 10, 10);

    const tableData = history.map(entry => [
      new Date(entry.change_date).toLocaleDateString(),
      entry.points_changed,
      entry.reason,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [['Date', 'Points Changed', 'Reason']],
      body: tableData,
      startY: 20,
    });

    // Save the PDF
    doc.save(`Point_History_${driverUsername}.pdf`);
  };
  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h6">Point Change History for {driverUsername}</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generatePDF} 
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
