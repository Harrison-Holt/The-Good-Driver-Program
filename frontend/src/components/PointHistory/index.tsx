import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';
import { fetchPointChangeHistory } from '../../utils/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAppSelector } from "../../store/hooks";
import { selectUserType } from "../../store/userSlice";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PointHistoryEntry {
  change_date: string;
  points_changed: number;
  reason: string;
}

const PointHistory: React.FC<{ driverUsername: string }> = ({ driverUsername }) => {
  const [history, setHistory] = useState<PointHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get user type from Redux store inside the component
  const userType = useAppSelector(selectUserType);

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
    const title = userType === 'sponsor'
      ? 'Point Change History for All Drivers'
      : `Point Change History for ${driverUsername}`;
    doc.text(title, 10, 10);

    const tableData = history.map(entry => [
      new Date(entry.change_date).toLocaleDateString(),
      entry.points_changed,
      entry.reason,
    ]);

    doc.autoTable({
      head: [['Date', 'Points Changed', 'Reason']],
      body: tableData,
      startY: 20,
    });

    doc.save(`Point_History_${driverUsername}.pdf`);
  };

  return (
    <Box sx={{ padding: '16px', position: 'relative' }}>
      <Typography variant="h6">
        {userType === "sponsor"
          ? 'Point Change History for All Drivers'
          : `Point Change History for ${driverUsername}`}
      </Typography>
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
