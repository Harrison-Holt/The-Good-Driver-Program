import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice";
import { fetchPointChangeHistory, fetchPointChangeNotification, updatePointChangeNotification, updateUserName } from "../../utils/api";

// Copied from PointHistory
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
// Copied from PointHistory
interface PointHistoryEntry {
  change_date: string;
  points_changed: number;
  reason: string;
}

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);
    const username = useAppSelector(selectUserName);
    const firstName = useAppSelector(selectFirstName);
    const lastName = useAppSelector(selectLastName);
    const email = useAppSelector(selectEmail);

    const [newFirstName, setNewFirstName] = useState<string>(firstName || '');
    const [newLastName, setNewLastName] = useState<string>(lastName || '');
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [history, setHistory] = useState<PointHistoryEntry[]>([]);
    useEffect(() => {
        const fetchNotificationPreference = async () => {
            if (username) {
                try {
                    const notificationPreference = await fetchPointChangeNotification(username);
                    if (notificationPreference !== null) {
                        setEmailNotifications(notificationPreference);
                    }
                } catch (error) {
                    console.error("Error fetching notification preference:", error);
                }
            }
        };

        fetchNotificationPreference();

        const loadPointHistory = async () => {
            var pointHistory;
            if (username) {
                pointHistory = await fetchPointChangeHistory(username);
            }
            if (pointHistory) {
              setHistory(pointHistory);
            }
          };
      
          loadPointHistory();
    }, [username]);

    const orderHist = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const oHist = [];
    const oIDs = [""];
    const oItems = [""];
    for (const i of orderHist) {
        for (const j of i.items) {
            oHist.push(<Typography>{i.orderId}: {j}</Typography>);
            oIDs.push(i.orderId);
            oItems.push(j)
        }
    };
    console.log(oHist);

    const generatePDF1 = () => {
        const doc = new jsPDF();
        const title = userType === 'sponsor'
          ? 'Point Change History for All Drivers'
          : `Point Change History for ${username}`;
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
    
        doc.save(`Point_History_${username}.pdf`);
      };

      const generatePDF2 = () => {
        const doc = new jsPDF();
        const title = userType === 'sponsor'
          ? 'Order History for All Drivers'
          : `Order History for ${username}`;
        doc.text(title, 10, 10);

        doc.autoTable({
            head: [['Order ID', 'Item(s)']],
            body: [oIDs,oItems],
            startY: 20,
        });
    
        doc.save(`Order_History_${username}.pdf`);
      };

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setEmailNotifications(isChecked);

        if (username) {
            try {
                const success = await updatePointChangeNotification(username, isChecked);
                if (!success) {
                    alert("Failed to update notification preference on server");
                    setEmailNotifications(!isChecked);
                }
            } catch (error) {
                console.error("Error updating notification preference:", error);
                setEmailNotifications(!isChecked);
            }
        }
    };

    const handleProfileUpdate = async () => {
        if (username) {
            try {
                const response = await updateUserName(username, newFirstName, newLastName, newEmail);
                if (response) {
                    alert("Profile updated successfully");
                } else {
                    alert("Failed to update profile");
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(`Error updating profile: ${error.message}`);
                } else {
                    alert("An unexpected error occurred");
                }
            }
        } else {
            alert("Username is null, cannot update profile");
        }
    };

    return (
        <div>
            <Typography variant="h5">{userType === "driver" ? "Driver Profile" : userType === "sponsor" ? "Sponsor Profile" : "Admin Profile"}</Typography>
            <Typography>Name: {firstName} {lastName}</Typography>
            <Typography>Email: {email}</Typography>
            <Typography>Role: {userType}</Typography>
            
            <FormControlLabel
                control={
                    <Checkbox
                        checked={emailNotifications}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                }
                label="Receive notifications for point changes"
            />

            <div>
                <Typography>Order History</Typography>
                {oHist}
            </div>

            <div>
                <Button variant="contained" color="primary" onClick={generatePDF1}>
                    Generate Points Report 
                </Button>
                <Button variant="contained" color="primary" onClick={generatePDF2}>
                    Generate Order Report 
                </Button>
            </div>

            {isEditing ? (
                <>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProfileUpdate}
                        sx={{ marginTop: 2 }}
                    >
                        Submit
                    </Button>
                </>
            ) : (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    sx={{ marginTop: 2 }}
                >
                    Edit Profile
                </Button>
            )}
        </div>
    );
};

export default Profile;
