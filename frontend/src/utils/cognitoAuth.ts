import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import { poolData } from './awsConfig';  // Adjust path as needed

const userPool = new CognitoUserPool(poolData);

export async function signIn(username: string, password: string): Promise<{ accessToken: string, idToken: string, refreshToken: string }> {
  const authenticationData = {
    Username: username,
    Password: password,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        console.log('Access Token:', accessToken);
        resolve({ accessToken, idToken, refreshToken });
      },
      onFailure: (err: unknown) => {  // Using `unknown` for err for flexibility
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
          reject(err);
        } else if (session) {
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
