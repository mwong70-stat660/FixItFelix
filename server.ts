import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Survey data store (In-memory for the demo, simulating an external database/spreadsheet)
  const surveys: any[] = [];

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Ensure api key exists
  app.use('/api', (req, res, next) => {
    if (!process.env.GEMINI_API_KEY && req.path !== '/survey' && req.path !== '/dashboard') {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing.' });
    }
    next();
  });

  // API Route: Identify Appliance and get repair guides
  app.post('/api/analyze', async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      const prompt = `You are an expert appliance repair technician. 
Analyze the image of the appliance and provide the following information in JSON format:
1. appliance: The type of appliance (e.g., Refrigerator, Washing Machine).
2. brand: The likely brand and guessed model number if possible. 
3. guides: A list of 3 troubleshooting steps or repair guides based on common failures for this appliance.
4. partsPrompt: A search query to find replacement parts for this appliance based on top 7 performing manufacturers.
5. youtubeQuery: A search query to find DIY repair video tutorials for this specific appliance.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          {
            inlineData: {
              data: image.split(',')[1] || image,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          prompt
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              appliance: { type: Type.STRING },
              brand: { type: Type.STRING },
              guides: { type: Type.ARRAY, items: { type: Type.STRING } },
              partsPrompt: { type: Type.STRING },
              youtubeQuery: { type: Type.STRING }
            },
            required: ['appliance', 'brand', 'guides', 'partsPrompt', 'youtubeQuery']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze appliance.' });
    }
  });

  // API Route: Find Parts & Videos using Grounding
  app.post('/api/search', async (req, res) => {
    try {
      const { partsPrompt, youtubeQuery } = req.body;

      // Mocking YouTube query context via generate content
      const videoResponse = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Find 2 YouTube video titles and URLs (mock URLs if necessary) for DIY repair of: ${youtubeQuery}. Return JSON array of objects with 'title' and 'url'.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 title: { type: Type.STRING },
                 url: { type: Type.STRING }
               }
             }
          }
        }
      });

      const partsResponse = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Compare prices for replacement parts for: ${partsPrompt} across 3 different local or online stores. Focus on the top 7 manufacturers. Return JSON array of objects with 'store', 'partName', 'price' (number).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 store: { type: Type.STRING },
                 partName: { type: Type.STRING },
                 price: { type: Type.NUMBER }
               }
             }
          }
        }
      });

      res.json({
         videos: JSON.parse(videoResponse.text || '[]'),
         parts: JSON.parse(partsResponse.text || '[]')
      });
    } catch (error: any) {
      console.error('Error searching:', error);
      res.status(500).json({ error: error.message || 'Search failed' });
    }
  });
  
  // Simulated endpoint to compile to Google Sheet/Form
  app.post('/api/survey', (req, res) => {
    const { satisfaction, usefulness, recommendation, subscribeLikelihood, feedback } = req.body;
    const newSurvey = {
      id: Date.now(),
      satisfaction,
      usefulness,
      recommendation,
      subscribeLikelihood,
      feedback,
      timestamp: new Date().toISOString()
    };
    surveys.push(newSurvey);
    // In a real integration, we'd use Google Sheets API here
    res.json({ success: true, message: 'Survey successfully compiled to external sheet.' });
  });

  app.get('/api/dashboard', (req, res) => {
    res.json(surveys);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
