'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Campaign {
  advertId: number;
  name: string;
  type: number;
  status: number;
}

interface CampaignStats {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
  sum: number;
  atbs: number;
  orders: number;
  cr: number;
  shks: number;
  sum_price: number;
}

export default function Dashboard() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [stats, setStats] = useState<CampaignStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    setIsApiKeySet(true);
    setError('');
    loadCampaigns();
  };

  const loadCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/campaigns/list`, {
        headers: {
          'X-API-Key': apiKey,
        },
      });
      setCampaigns(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load campaigns');
      setIsApiKeySet(false);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignStats = async (campaignId: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/campaigns/fullstats`,
        {
          id: [campaignId],
          dates: {
            from: dateFrom,
            to: dateTo,
          },
        },
        {
          headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = response.data || [];
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load campaign statistics');
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaignId: number) => {
    setSelectedCampaign(campaignId);
    loadCampaignStats(campaignId);
  };

  const calculateTotals = () => {
    if (stats.length === 0) return { totalViews: 0, totalClicks: 0, avgCTR: 0, totalSum: 0 };
    
    const totalViews = stats.reduce((sum, stat) => sum + (stat.views || 0), 0);
    const totalClicks = stats.reduce((sum, stat) => sum + (stat.clicks || 0), 0);
    const totalSum = stats.reduce((sum, stat) => sum + (stat.sum || 0), 0);
    const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    
    return { totalViews, totalClicks, avgCTR, totalSum };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Wildberries Ads Analytics Dashboard
        </h1>

        {!isApiKeySet ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Key Setup</h2>
            <div className="flex gap-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Wildberries API key"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSetApiKey}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect
              </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Select Campaign</h2>
                <button
                  onClick={() => {
                    setIsApiKeySet(false);
                    setCampaigns([]);
                    setStats([]);
                    setSelectedCampaign(null);
                  }}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Change API Key
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign
                  </label>
                  <select
                    value={selectedCampaign || ''}
                    onChange={(e) => handleCampaignSelect(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.advertId} value={campaign.advertId}>
                        {campaign.name} (ID: {campaign.advertId})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {selectedCampaign && (
                <button
                  onClick={() => loadCampaignStats(selectedCampaign)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Loading...' : 'Refresh Data'}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
                {error}
              </div>
            )}

            {stats.length > 0 && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Views</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {totals.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Clicks</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {totals.totalClicks.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Average CTR</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {totals.avgCTR.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Spent</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      ₽{totals.totalSum.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Views and Clicks Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Views"
                        />
                        <Line
                          type="monotone"
                          dataKey="clicks"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Clicks"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      CTR (Click-Through Rate)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ctr" fill="#8b5cf6" name="CTR %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Detailed Statistics
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clicks
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CTR %
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spent (₽)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.map((stat, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.views?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.clicks?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.ctr?.toFixed(2) || '0.00'}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.sum?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.orders?.toLocaleString() || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            )}

            {!loading && selectedCampaign && stats.length === 0 && !error && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                No data available for the selected period.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
