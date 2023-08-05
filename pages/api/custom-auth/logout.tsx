import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader(
        'Set-Cookie',
        'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly; secure; samesite=strict'
    );
    res.setHeader(
        'Set-Cookie',
        'user-details=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly; secure; samesite=strict'
    );
    res.status(200).json({ message: 'Logged out successfully.', success: true, error: false });
}
