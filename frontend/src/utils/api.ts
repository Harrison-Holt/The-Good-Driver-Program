import axios from 'axios';

// Define the UserInfo type if needed (this helps with TypeScript type checking)
interface UserInfo {
  username: string;
  email: string;
  points: number | null;
}

// Function to fetch user info from API based on the username
export const fetchUserInfo = async (username: string): Promise<UserInfo | null> => {
  try {
    const response = await axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/get-user-info/${username}`);
    return response.data;  // Assuming that response.data contains the user information
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;  // Return null or throw error based on your error-handling strategy
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