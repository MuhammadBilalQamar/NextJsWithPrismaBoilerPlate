export const validateJWTToken = async (token: string) => {
    if (!token) return false;
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/custom-auth/verifyJWT`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    const data = await response.json();
    if (data.error) return { error: true, success: false, userEmail: null };
    return { error: false, success: true, userEmail: data.userEmail };
};