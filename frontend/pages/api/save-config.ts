import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const config = req.body;
    
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const filePath = path.join(outputDir, 'selected_jobs.json');
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

    res.status(200).json({ message: 'Config saved successfully' });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ message: 'Error saving config' });
  }
} 