const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const WB_API_BASE_URL = 'https://advert-api.wildberries.ru';

app.use(cors());
app.use(express.json());

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  
  req.apiKey = apiKey;
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Wildberries Ads Analytics API is running' });
});

// Get list of advertising campaigns
app.get('/api/campaigns', validateApiKey, async (req, res) => {
  try {
    const response = await axios.get(`${WB_API_BASE_URL}/adv/v1/promotion/count`, {
      headers: {
        'Authorization': req.apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching campaigns:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch campaigns',
      details: error.response?.data || error.message
    });
  }
});

// Get list of all campaigns with details
app.get('/api/campaigns/list', validateApiKey, async (req, res) => {
  try {
    const response = await axios.get(`${WB_API_BASE_URL}/adv/v1/promotion/adverts`, {
      headers: {
        'Authorization': req.apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching campaigns list:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch campaigns list',
      details: error.response?.data || error.message
    });
  }
});

// Get campaign full statistics
app.post('/api/campaigns/fullstats', validateApiKey, async (req, res) => {
  try {
    const response = await axios.post(
      `${WB_API_BASE_URL}/adv/v3/fullstats`,
      req.body,
      {
        headers: {
          'Authorization': req.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching campaign stats:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch campaign statistics',
      details: error.response?.data || error.message
    });
  }
});

// Get search query clusters statistics
app.post('/api/clusters/stats', validateApiKey, async (req, res) => {
  try {
    const response = await axios.post(
      `${WB_API_BASE_URL}/adv/v0/normquery/stats`,
      req.body,
      {
        headers: {
          'Authorization': req.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cluster stats:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch search cluster statistics',
      details: error.response?.data || error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Wildberries Ads Analytics API server running on port ${PORT}`);
});
