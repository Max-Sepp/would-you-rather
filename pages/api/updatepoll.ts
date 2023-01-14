import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../services/prisma'


type Output = {
  message: string
}

type Input = {
  leftClicked: boolean,
  id: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  const body: Input = req.body
  if (req.method === 'POST') {
    const question: any = await prisma.question.findUnique({
      where: {
        id: body.id
      }
    });

    if (question == null) {
      return res.status(404).json({message: "id of would you rather not found"})
    }

    const leftChosen: number = (body.leftClicked) ? question.leftChosen + 1 : question.leftChosen

    const newQuestion: any = await prisma.question.update({
      where: {
        id: body.id
      },
      data: {
        leftChosen: leftChosen,
        totalChosen: question.totalChosen + 1
      },
    });
    return res.status(200).json({message: "success"})
  }

  return res.status(404).json({message: "only accepts post requests"})
}
