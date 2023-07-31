import cognitoJWTVerifier from './cognitoJWTVerifier';
import { regenerateTokens } from './cognito';
import setCookies from './setCookies';

interface Tokens {
  accessToken: string | undefined;
  idToken: string | undefined;
  refreshToken: string | undefined;
}

const verifier = cognitoJWTVerifier('access');
const verifier2 = cognitoJWTVerifier('id');

const verifyJWT = async ({ accessToken, idToken, refreshToken }: Tokens): Promise<{
  res: any
  success: boolean
}> => {
  // if any of the tokens is undefined
  if (!refreshToken) return {
    res: 'Insufficient tokens',
    success: false,
  };
  let accessPayload, idPayload;
  try {
    if (accessToken && idToken) {
      console.log('trying to validate tokens');
      [accessPayload, idPayload] = await Promise.all([
        verifier.verify(accessToken as string),
        verifier2.verify(idToken as string),
      ]);
    }

  } catch (e) {
    console.log('access token expired');
  }
  if (!accessPayload || !idPayload) {
    console.log('trying to regenerate tokens');
    try {
      const res = await regenerateTokens(refreshToken as string); // Regenerate tokens
      console.log('regenerated tokens', res);
      await setCookies(res.AuthenticationResult); // Set latest tokens
      // Getting latest cookies after setting
      accessToken = res.AuthenticationResult?.AccessToken as string; // Get latest access token
      idToken = res.AuthenticationResult?.IdToken as string;// Get latest id token
      [accessPayload, idPayload] = await Promise.all([
        verifier.verify(accessToken as string),
        verifier2.verify(idToken as string),
      ]);
    } catch (e) {
      console.log('unable to regenerate tokens', e);
    }
  }
  console.log('accessPayload', accessPayload);

  if (!accessPayload || !idPayload) {
    return {
      res: 'Corrupted tokens.',
      success: false,
    };
  }
  return {
    res: {
      accessPayload,
      idPayload,
    },
    success: true,
  };

};


export default verifyJWT;
