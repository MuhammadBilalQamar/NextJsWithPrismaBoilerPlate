import { setCookie } from 'cookies-next';

class FECookiesHelper {

    // IT WILL CREATE USER COOKIE
    static createCookieUser = async (email: string) => {
        try {
            const { data: [user] } = await (await fetch(new URL(`/api/users?search=${email}`, process.env.NEXT_PUBLIC_APP_URL), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json();
            if (user) {
                const userCookie = JSON.stringify({
                    ...user,
                })
                setCookie('user-details', userCookie);
                return userCookie;
            }
            else {
                return null;
            }
        } catch (error) {
            setCookie('user-details', null);
            return null;
        }
    }

    // IT WILL DELETE USER COOKIE
    static deleteCookieUser = () => {
        setCookie('user-details', null);
    }

    // IT WILL CLEAR ALL COOKIES
    static clearAllCookies = () => {
        try {
            const cookies = document.cookie.split(';');

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            }
        } catch (error) {
            console.log(error);
        }
    };

    // GET SPECIFIC COOKIE
    static getCookie = (name: string) => {
        try {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf('=');
                const cookieName = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                if (cookieName.trim() === name.trim()) {
                    return cookie.substr(eqPos + 1);
                }
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    // IT WILL CREATE USER COOKIE
    static getUser = async (email: string) => {
        try {
            const { data: [user] } = await (await fetch(new URL(`/api/users?search=${email}`, process.env.NEXT_PUBLIC_APP_URL), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json();
            if (user) {
                return user;
            }
            else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }
}

export default FECookiesHelper;
