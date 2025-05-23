import process from 'node:process';
import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: 'instance/.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Security Scorecard API key from environment variables
const API_KEY = process.env.SECURITYSCORECARD_API_KEY;
const API_BASE_URL = 'https://api.securityscorecard.io';
const API_PREFIX = '/api/securityscorecard';

if (!API_KEY) {
  console.error('SECURITYSCORECARD_API_KEY is not set in environment variables');
  process.exit(1);
}

// Middleware
app.use(express.json());

// Generic proxy for all SecurityScorecard API GET requests
app.get(`${API_PREFIX}/*`, async (req, res) => {
  try {
    // Extract the path after the prefix
    const apiPath = req.path.substring(API_PREFIX.length);
    
    // Build the target URL
    const targetUrl = `${API_BASE_URL}${apiPath}`;
    
    console.log(`Proxying GET request to: ${targetUrl}`);
    
    // Forward query parameters
    const queryString = Object.keys(req.query).length > 0 
      ? '?' + new URLSearchParams(req.query).toString() 
      : '';
    
    // Make the request to SecurityScorecard API
    const response = await fetch(`${targetUrl}${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Get response data
    const data = await response.json();
    
    // Forward the response status and data
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to proxy request', 
      message: error.message 
    });
  }
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// For any other routes, serve the index.html (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
