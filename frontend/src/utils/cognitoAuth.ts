import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import { poolData } from './awsConfig';

const userPool = new CognitoUserPool(poolData);

export async function signIn(username: string, password: string): Promise<void> {
  const authenticationData = { Username: username, Password: password };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userData = { Username: username, Pool: userPool };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        
        // Save tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('refreshToken', refreshToken);

        console.log('User signed in successfully.');
        resolve();
      },
      onFailure: (err: unknown) => {
        console.error('Sign in error:', err);
        reject(err);
      },
    });
  });
}

export async function getSession(): Promise<CognitoUserSession> {
  const cognitoUser = userPool.getCurrentUser();

  return new Promise((resolve, reject) => {
    if (cognitoUser) {
      cognitoUser.getSession((err: unknown, session: CognitoUserSession | null) => {
        if (err) {
          console.error('Error getting session:', err);
          reject(err);
        } else if (session) {
          console.log('User session retrieved:', session);
          resolve(session);
        } else {
          reject(new Error('No session found.'));
        }
      });
    } else {
      reject(new Error('No user is signed in.'));
    }
  });
}
