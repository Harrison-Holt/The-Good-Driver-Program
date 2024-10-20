
import { jwtDecode } from 'jwt-decode';

// Define the structure of the decoded token
interface DecodedToken {
  email?: string;
  username?: string;
  sub?: string; // User ID
}

export function getUsernameFromToken(token: string): string | null {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    // Return username if it exists, otherwise return email or null
    return decodedToken.username || decodedToken.email || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
