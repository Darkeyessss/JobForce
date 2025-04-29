import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    
    const filePath = path.join(outputDir, 'resume-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    exec('python3 Agent1/agent1.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`执行出错: ${error}`);
        return res.status(500).json({ message: 'Error running Python script' });
      }
      console.log(`Python输出: ${stdout}`);
    });

    res.status(200).json({ message: 'Resume data saved successfully' });
  } catch (error) {
    console.error('Error saving resume data:', error);
    res.status(500).json({ message: 'Error saving resume data' });
  }
} 

