"use client"
import { useEffect } from "react";
import FECookiesHelper from "./FECookiesHelper";

export const ValidateSession = () => {
    useEffect(() => {
        const accessToken = FECookiesHelper.getCookie('access-token')
        const idToken = FECookiesHelper.getCookie('id-token')
        const refreshToken = FECookiesHelper.getCookie('refresh-token')
        const userDetail = FECookiesHelper.getCookie('user-details')
        const isSessionExisits = accessToken && idToken && refreshToken && userDetail
        if (!isSessionExisits) {
            FECookiesHelper.clearAllCookies();
            FECookiesHelper.deleteCookieUser();
            window.location.href = '/';
        } else if (isSessionExisits) {
            const isValidTokenResponse = fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/verifyJWT`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken,
                    idToken,
                    refreshToken,
                }),
            }).then((res) => res.json());
            isValidTokenResponse.then((res) => {
                if (!res.success) {
                    FECookiesHelper.clearAllCookies();
                    FECookiesHelper.deleteCookieUser();
                    window.location.href = '/';
                }
            });
        }
    }, []);
    return null;
};