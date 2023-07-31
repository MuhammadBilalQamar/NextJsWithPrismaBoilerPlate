import {
  CognitoIdentityProvider,
  ListUsersCommand,
  AdminUpdateUserAttributesResponse,
  SignUpResponse,
  RespondToAuthChallengeCommandOutput,
  AdminCreateUserCommandOutput,
  AdminInitiateAuthCommandOutput,
  GetUserCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommandOutput,
  InitiateAuthCommandOutput,
  ResendConfirmationCodeCommandOutput,
  ConfirmSignUpCommandOutput,
  // ListUsersCommandOutput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { AdminUpdateUserAttributesCommandOutput } from '@aws-sdk/client-cognito-identity-provider/dist-types/commands/AdminUpdateUserAttributesCommand';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

let cognitoIdentityServiceProvider = new CognitoIdentityProvider({
  apiVersion: '2016-04-18',
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  credentials: {
    accessKeyId: process.env.COGNITO_API_KEY || '',
    secretAccessKey: process.env.COGNITO_API_SECRET || '',
  },
});

let cognitoIdentityServiceProviderClient = new CognitoIdentityProviderClient({
  apiVersion: '2016-04-18',
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  credentials: {
    accessKeyId: process.env.COGNITO_API_KEY || '',
    secretAccessKey: process.env.COGNITO_API_SECRET || '',
  },
});

export const updateUserAttribute = (
  username: string,
  name: string,
  value: string
): Promise<AdminUpdateUserAttributesResponse> => {
  return new Promise((resolve) => {
    let params = {
      UserAttributes: [
        {
          Name: name,
          Value: value,
        },
      ],
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL!,
      Username: username,
    };
    cognitoIdentityServiceProvider.adminUpdateUserAttributes(
      params,
      function (data: AdminUpdateUserAttributesCommandOutput) {
        resolve(data);
      }
    );
  });
};

export const getCognitoUsers = (id: string | null = null): Promise<User[]> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const params = {
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL!,
      Filter: '',
    };

    if (id) {
      params['Filter'] = `sub = "${id}"`;
    } else {
      params['Filter'] = `cognito:user_status = "confirmed"`;
    }
    const listUsersCommand = new ListUsersCommand(params);
    const data = await cognitoIdentityServiceProviderClient.send(
      listUsersCommand
    );
    const users: {id: string, username: string, email: string, name: string}[] = [];
    if (data && data.Users) {
      data.Users.forEach((user: any) => {
        users.push({
          id: user.Attributes.find((a: any) => a.Name === 'sub')?.Value,
          username: user.Username,
          name: user.Attributes.find((a: any) => a.Name === 'name')?.Value,
          email: user.Attributes.find((a: any) => a.Name === 'email')?.Value,
        });
      });
    }
    resolve(users);
  });
};

// signup only works with email
export const signUpUser = (
  email: string,
  password: string
): Promise<SignUpResponse> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.signUp(
      {
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        Password: password,
        Username: email.split('@').join('-').split('.').join('-'),
        UserAttributes: [
          {
            Name: 'name',
            Value: 'Random name',
          },
          {
            Name: 'email',
            Value: email,
          },
        ],
      },
      (err, data) => {
        if (err || !data) {
          reject(err);
        }
        if (data) resolve(data);
      }
    );
  });
};

// signup with auto verified accounts
export const adminCreateUser = (
  email: string,
  password: string
): Promise<SignUpResponse> => {
  return new Promise((resolve, reject) => {
    const params = {
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL || '',
      Username: email.split('@').join('-').split('.').join('-'),
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS', // Do not send an email invitation
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true', // Automatically verify the email address
        },
      ],
    };
    cognitoIdentityServiceProvider.adminCreateUser(
      params,
      function (err: any, data: any) {
        if (err || !data) {
          reject(err);
        }
        // you can get userSub like that const userSub = res?.User?.Attributes[0]?.Value || undefined;
        if (data) resolve(data);
      }
    );
  });
};
// user confirmation only works with username
export const confirmUser = (
  email: string,
  code: string
): Promise<ConfirmSignUpCommandOutput> => {
  return new Promise((resolve, reject) => {
    if (!email || !code) {
      return reject('Not given enough parameters');
    }

    cognitoIdentityServiceProvider.confirmSignUp(
      {
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        Username: email,
        ConfirmationCode: code,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};

// Resend code for user confirmation
export const resendConfirmationCode = (
  email: string
): Promise<ResendConfirmationCodeCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.resendConfirmationCode(
      {
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        Username: email,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};
// signin works with both username and email
export const signInUser = (
  email: string,
  password: string
): Promise<InitiateAuthCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.initiateAuth(
      {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};

export const forgotPassword = (
  email: string
): Promise<ForgotPasswordCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.forgotPassword(
      {
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        Username: email,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};

export const confirmForgotPassword = (
  username: string,
  password: string,
  code: string
): Promise<ConfirmForgotPasswordCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.confirmForgotPassword(
      {
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        Username: username,
        ConfirmationCode: code,
        Password: password,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};

export const getCognitoUser = (
  accessToken: string | boolean
): Promise<GetUserCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.getUser(
      {
        AccessToken: accessToken as string,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};

export const regenerateTokens = (
  refreshToken: string
): Promise<AdminInitiateAuthCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminInitiateAuth(
      {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL!,
      },
      (err, data) => {
        if (err || !data) reject(err);
        if (data) resolve(data);
      }
    );
  });
};

export const createStaffUser = (
  username: string,
  name: string,
  email: string
): Promise<AdminCreateUserCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminCreateUser(
      {
        Username: username,
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL!,
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [
          {
            Name: 'name',
            Value: name,
          },
          {
            Name: 'email',
            Value: email,
          },
        ],
      },
      (err, data) => {
        if (err || !data) return reject(err);
        if (data) resolve(data);
      }
    );
  });
};

// Force changing password for staff users after first login

export const forceChangePassword = (
  username: string,
  newPassword: string,
  challengeName: string,
  session: string
): Promise<RespondToAuthChallengeCommandOutput> => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.respondToAuthChallenge(
      {
        ChallengeName: challengeName,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
        ChallengeResponses: {
          NEW_PASSWORD: newPassword,
          USERNAME: username,
        },
        Session: session,
      },
      (err, data) => {
        if (err || !data) return reject(err);
        if (data) resolve(data);
      }
    );
  });
};
