import axios from 'axios';

// Define the UserInfo type for TypeScript type checking
interface UserInfo {
  username: string;
  email: string;
  points: number | null;
  point_change_notification: boolean;
}

interface PointHistoryEntry {
  change_date: string;
  points_changed: number;
  reason: string;
}

// Function to fetch user info from API based on the username
export const fetchUserInfo = async (username: string): Promise<UserInfo | null> => {
  try {
    const response = await axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/${username}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null; 
  }
};

// Function to fetch user points from the user info
export const fetchUserPoints = async (username: string): Promise<number | null> => {
  const userInfo = await fetchUserInfo(username);
  if (userInfo) {
    return userInfo.points;
  } else {
    return null;
  }
};

// New function to update the user's point change notification preference
export const updatePointChangeNotification = async (username: string, enableNotification: boolean): Promise<boolean> => {
  try {
    const response = await axios.patch(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/${username}`, {
      username,
      point_change_notification: enableNotification
    });
    return response.status === 200;  // Return true if update was successful
  } catch (error) {
    console.error('Error updating notification preference:', error);
    return false;  // Return false if the update failed
  }
};

// Function to fetch the user's notification preference
export const fetchPointChangeNotification = async (username: string): Promise<boolean | null> => {
  const userInfo = await fetchUserInfo(username);
  return userInfo ? userInfo.point_change_notification : null;
};

// Function to fetch point change history based on the username
export const fetchPointChangeHistory = async (username: string): Promise<PointHistoryEntry[] | null> => {
  try {
    const response = await axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/point-history/${username}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching point change history:', error);
    return null;
  }
};

/** example of how to call one of these functions in another file:
 
    import { fetchUserPoints } from '../utils/api'; //change as needed

    const logUserPoints = async (username: string) => {
    try {
        const points = await fetchUserPoints(username);
        if (points !== null) {
        console.log(`User ${username} has ${points} points.`);
        } else {
        console.log(`No points data found for user ${username}.`);
        }
    } catch (error) {
        console.error('Failed to fetch user points:', error);
    }
    };

    // Example usage
    logUserPoints('admoral');
*/