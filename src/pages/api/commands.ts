import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  commands: string[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const commands: string[] = []
  res.status(200).json({
    commands,
  })
}
