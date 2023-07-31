import { cookies } from 'next/headers';

export default async function getCookieUser() {
    const cookieStore = cookies();
    const storeUser = cookieStore.get('user-details')?.value;
    const parsedUser = (storeUser && storeUser != '') ? JSON.parse(storeUser) : null;
    return parsedUser
        ? { success: true, user: parsedUser }
        : { success: false, user: null };
}