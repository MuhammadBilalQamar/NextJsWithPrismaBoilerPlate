import { setCookie } from "cookies-next";
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';

export default function setCookies(authRes: AuthenticationResultType | undefined): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (!authRes) reject({
            message: "No tokens were provided"
        })
        if (authRes?.AccessToken) setCookie("access-token", authRes.AccessToken, {
            maxAge: authRes.ExpiresIn
        })
        if (authRes?.IdToken) setCookie("id-token", authRes.IdToken, {
            maxAge: authRes.ExpiresIn
        })
        if (authRes?.RefreshToken) setCookie("refresh-token", authRes.RefreshToken, {
            maxAge: 30 * 24 * 60 * 60
        })
        resolve(true)
    })
}
