// pages/api/share.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSharedCode } from '@/lib/share-code' // Your database/service layer

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing share ID' })
  }

  try {
    const sharedCode = await getSharedCode(id)
    if (!sharedCode) {
      return res.status(404).json({ error: 'Share not found' })
    }
    return res.status(200).json(sharedCode)
  } catch (error) {
    console.error('Error fetching shared code:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}