import type { NextApiRequest, NextApiResponse } from 'next'
import { faker } from '@faker-js/faker/locale/ko';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { cursor } = req.query;

    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        id: faker.string.uuid(),
        name: faker.person.firstName(),
      })
    }

    res.status(200).json({ data, nextCursor: Number(cursor) + 1 })
  }
}