import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized', error: true, success: true });
        }

        try {
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || '');
            const expirationTimestamp = decodedToken?.exp || 0;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            console.log("access payload==========", {
                decodedToken,
                currentTimestamp,
                expirationTimestamp,
                isTokenExpired: currentTimestamp > expirationTimestamp
            })
            if (currentTimestamp > expirationTimestamp) {
                return res.status(401).json({ message: 'Token expired', error: true, success: false });
            }
            return res.status(200).json({ message: 'Authorized', error: false, success: true, userEmail: decodedToken?.email });
        } catch (error: any) {
            return res.status(401).json({ message: 'Invalid token', error: true, details: JSON.stringify(error) });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed', error: true });
    }
}
