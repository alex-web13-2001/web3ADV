# Quick Start Guide - Wildberries Ads Analytics Dashboard

## Prerequisites
- Node.js 18+ installed
- Valid Wildberries Ads API key

## Quick Start (Using start.sh)

The easiest way to run the entire application:

```bash
chmod +x start.sh
./start.sh
```

This will:
1. Install dependencies for both backend and frontend (if needed)
2. Start the backend server on port 3001
3. Start the frontend server on port 3000
4. Open your browser to http://localhost:3000

Press `Ctrl+C` to stop both servers.

## Manual Start

### Backend

```bash
cd backend
npm install
npm start
```

Backend runs on http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Using the Dashboard

1. **Get Your API Key**
   - Log in to your Wildberries Seller account
   - Navigate to the API section
   - Generate or copy your API key

2. **Connect to Dashboard**
   - Open http://localhost:3000 in your browser
   - Enter your Wildberries API key
   - Click "Connect"

3. **View Campaign Analytics**
   - Select a campaign from the dropdown
   - Adjust date range if needed (default: last 30 days)
   - Click "Refresh Data" to update statistics
   - View metrics in cards, charts, and tables

## Testing the Backend API

Run the test script to verify the backend is working:

```bash
cd backend
npm start  # In one terminal

# In another terminal
chmod +x test-api.sh
./test-api.sh
```

## Production Build

### Frontend Production Build

```bash
cd frontend
npm run build
npm start  # Runs production server
```

### Backend Production

The backend uses the same command for dev and production:

```bash
cd backend
npm start
```

For production, consider using a process manager like PM2:

```bash
npm install -g pm2
cd backend
pm2 start server.js --name wildberries-api
```

## Environment Variables

### Backend (.env)
```
PORT=3001  # Optional, defaults to 3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001  # Optional, defaults to this
```

For production, update NEXT_PUBLIC_API_URL to your production backend URL.

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use:

**Backend:**
Create `.env` file:
```
PORT=3002
```

**Frontend:**
Start with custom port:
```bash
PORT=3001 npm run dev
```

And update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### API Connection Errors
- Ensure backend is running on port 3001
- Check firewall settings
- Verify API key is valid
- Check browser console for detailed error messages

### No Data Showing
- Verify the selected campaign has data for the chosen date range
- Try selecting a different date range
- Check that your API key has permissions for the selected campaign

## Features Overview

### Metrics Displayed
- **Total Views**: Sum of all impressions
- **Total Clicks**: Sum of all clicks
- **Average CTR**: Click-through rate percentage
- **Total Spent**: Total advertising spend in rubles
- **Orders**: Number of orders generated
- **Daily Statistics**: Day-by-day breakdown

### Charts
- **Line Chart**: Views and Clicks over time
- **Bar Chart**: CTR (Click-Through Rate) percentage

### Data Table
Detailed daily statistics with all metrics including:
- Date
- Views (impressions)
- Clicks
- CTR percentage
- Amount spent
- Orders

## API Endpoints Reference

All endpoints require `X-API-Key` header (except `/api/health`):

- `GET /api/health` - Health check
- `GET /api/campaigns/list` - Get all campaigns
- `POST /api/campaigns/fullstats` - Get campaign statistics
- `POST /api/clusters/stats` - Get search cluster statistics

## Support

For issues or questions:
- Check the main README.md
- Verify Wildberries API documentation
- Ensure your API key has the necessary permissions
