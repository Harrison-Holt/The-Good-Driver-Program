
import { jwtDecode } from 'jwt-decode';

// Define the structure of the decoded token
interface DecodedToken {
  username?: string;
  email?: string;
  sub?: string; // User ID
}

export function getUsernameFromToken(token: string): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwtDecode(token);

    const decodedToken: DecodedToken = {
        username: decoded['cognito:username'],  // Rename 'cognito:username' to 'username'
        email: decoded.email,
        sub: decoded.sub,
    }

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
