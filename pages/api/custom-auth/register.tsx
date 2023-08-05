import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prismadb from 'configs/primsadb';
import { RolesEnums } from 'enums/roles.enums';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email, password, firstName, lastName, phone, city, state, dateOfBirth } = req.body;
            const isUserAlreadyTaken: boolean = await checkIfUserEmailTaken(email, phone);

            if (isUserAlreadyTaken) {
                res.status(409).json({ message: 'User with this email or phone number already taken', error: true });
            } else {

                const hashedPassword: string = await hashPassword(password);
                const reqBody: any = {
                    email,
                    firstName,
                    lastName,
                    phone,
                    city,
                    state,
                    dateOfBirth,
                    password: hashedPassword,
                    role: {
                        connect: { name: RolesEnums.User }
                    }
                }
                const user = await prismadb.users.create({ data: reqBody })
                // AFTER EACH SIGNUP USER NEEDS TO VERIFY HIS ACCOUNT THEN ONLY HE CAN LOGIN THATS WHY WE ARE NOT GENERATING TOKEN HERE
                // const token: string = jwt.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: TOKEN_EXPIRATION });
                // res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
                res.status(201).json({ message: 'Registration successful', user, error: false });
            }
        } catch (error) {
            console.log("error====>", error)
            res.status(500).json({ message: 'Something went wrong', error: true, errorDetails: JSON.stringify(error) });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed', error: true });
    }
}

const checkIfUserEmailTaken = async (email: string, phone: string) => {
    const users = await prismadb.users.findMany({
        where: {
            OR: [
                { email: { contains: email, mode: 'insensitive' } },
                { phone: { contains: phone, mode: 'insensitive' } }
            ]
        }
    }).catch();
    if (users && users.length > 0) return true;
    return false;
}

const hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
