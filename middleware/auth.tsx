import jwt from 'jsonwebtoken';

export function authMiddleware(handler: any) {
    return (req: any, res: any) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized', error: true, success: true });
        }

        try {
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || '');
            req.user = decodedToken?.username || '';
            return handler(req, res);
        } catch (error: any) {
            return res.status(401).json({ message: 'Invalid token', error: true, details: JSON.stringify(error) });
        }
    };
}

// USAGE FOR PROTECTED API ROUTES
// import { authMiddleware } from '../../middleware/auth';
// export default authMiddleware((req, res) => {
//   // Your protected API logic here
//   res.status(200).json({ message: `Hello, ${req.user}! This is a protected route.` });
// });