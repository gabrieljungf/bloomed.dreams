import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  interpretation?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dream } = req.body;

  if (!dream || typeof dream !== 'string') {
    return res.status(400).json({ error: 'Invalid dream input' });
  }

  try {
    // Call to n8n webhook or serverless function that integrates with GPT-4
    // For MVP, simulate the call here or replace with actual fetch to n8n endpoint

    // Example: Replace with your actual n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      return res.status(500).json({ error: 'N8N webhook URL not configured' });
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dream }),
    });

    if (!response.ok) {
      throw new Error('Failed to get interpretation from n8n');
    }

    const data = await response.json();

    // Assuming n8n returns { interpretation: string }
    return res.status(200).json({ interpretation: data.interpretation });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
