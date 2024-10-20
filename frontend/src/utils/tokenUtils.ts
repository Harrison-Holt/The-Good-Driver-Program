
import { jwtDecode } from 'jwt-decode';

// Define the structure of the decoded token
interface DecodedToken {
  username?: string;
  email?: string;
  sub?: string; // User ID
}

export function getUsernameFromToken(token: string): string | null {
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken);
    // Return username if it exists, otherwise return email or null
    console.log('Username:', decodedToken.username || 'N/A');
    console.log('Email:', decodedToken.email || 'N/A');
    console.log('User ID:', decodedToken.sub || 'N/A');

    return decodedToken.username || decodedToken.email || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
