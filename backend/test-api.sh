#!/bin/bash

# Simple test script for backend API endpoints

API_URL="http://localhost:3001"

echo "Testing Wildberries Ads Analytics API..."
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
response=$(curl -s "${API_URL}/api/health")
if echo "$response" | grep -q "OK"; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed"
    echo "Response: $response"
fi

echo ""

# Test campaigns endpoint without API key (should fail)
echo "2. Testing campaigns endpoint without API key (should return 401)..."
response=$(curl -s -w "\n%{http_code}" "${API_URL}/api/campaigns/list")
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" = "401" ]; then
    echo "✓ Correctly returns 401 Unauthorized"
else
    echo "✗ Expected 401, got: $http_code"
fi

echo ""

# Test campaigns endpoint with fake API key (should fail with WB API error)
echo "3. Testing campaigns endpoint with invalid API key..."
response=$(curl -s -w "\n%{http_code}" -H "X-API-Key: fake-test-key" "${API_URL}/api/campaigns/list")
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" = "500" ] || [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
    echo "✓ Correctly handles invalid API key (HTTP $http_code)"
else
    echo "? Unexpected response: $http_code"
fi

echo ""
echo "Basic API tests completed!"
echo ""
echo "To test with a real API key:"
echo "curl -H \"X-API-Key: YOUR_ACTUAL_KEY\" ${API_URL}/api/campaigns/list"
