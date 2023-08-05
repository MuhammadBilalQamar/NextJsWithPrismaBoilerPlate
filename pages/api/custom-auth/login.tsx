import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prismadb from 'configs/primsadb';
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRATION = '8H'; // Token expiration time (e.g., '1h' for 1 hour)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        const isValidUser: any = await checkUserCredentials(email, password);

        if (isValidUser) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: TOKEN_EXPIRATION });
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
            res.status(200).json({ message: 'Login successful', token, success: true, error: false });
        } else {
            res.status(401).json({ message: 'Invalid credentials', success: false, error: true });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed', error: true });
    }
}

const checkUserCredentials = async (email: string, password: string) => {
    const user = await prismadb.users.findFirst({
        where: { email: email }
    });
    if (!user) return false;
    const hashedPassword = user?.password;
    return bcrypt.compareSync(password, hashedPassword);
}
