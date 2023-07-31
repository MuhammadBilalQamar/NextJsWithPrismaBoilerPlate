import { CognitoJwtVerifier } from "aws-jwt-verify";
// verifier helper function for returning JWT verifier on the basis of token type
function cognitoJWTVerifier(tokenType: "access" | "id") {
    return CognitoJwtVerifier.create({
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL!,
        tokenUse: tokenType,
        clientId: process.env.NEXT_PUBLIC_COGNITO_ID!,
    });
}

export default cognitoJWTVerifier