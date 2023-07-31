import { getCookie } from 'cookies-next';

export default async function getSession() {
  let user = getCookie("user-details") as string;
  return user ? { success: true, user } : { success: false };
}