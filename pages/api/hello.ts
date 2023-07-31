// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' });
}

// code to sync users
//const users = await getCognitoUsers();
//   for (const u of users) {
//     try {
//       await fetch(`http://localhost:3000/api/sync-users/${u.id}`);
//     } catch (e) {
//       console.log(e);
//     }
//   }
