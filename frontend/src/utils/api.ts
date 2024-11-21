import axios from 'axios';

// Define the UserInfo type for TypeScript type checking
interface UserInfo {
  username: string;
  email: string;
  points: number | null;
  point_change_notification: boolean;
  sponsor_org_id: number | null;
}

interface PointHistoryEntry {
  change_date: string;
  points_changed: number;
  reason: string;
}

export interface DriverInfo {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
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

export const updateUserName = async (username:string, firstName:string, lastName:string, email:string) => {
  try {
    const response = await axios.patch(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/${username}`, {
      username,
      firstName,
      lastName,
      email
    });
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const fetchSponsorDrivers = async (sponsorOrgId: string): Promise<DriverInfo[] | null> => {
  try {
    console.log(`Fetching drivers for sponsorOrgId: ${sponsorOrgId}`); // Debugging log
    const response = await axios.get(
      `https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsors/${sponsorOrgId}`
    );
    return response.data; // Return the list of drivers
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error; // Throw the error to handle it in the calling code
  }
};
      