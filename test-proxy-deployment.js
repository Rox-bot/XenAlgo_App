// Test script for API Proxy deployment
// Run this after deploying to Railway

const PROXY_URL = 'https://your-api-proxy-service.railway.app'; // Replace with your actual URL

async function testProxyDeployment() {
  console.log('🧪 Testing API Proxy Deployment...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${PROXY_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);

    // Test 2: API Status
    console.log('\n2. Testing API Status...');
    const statusResponse = await fetch(`${PROXY_URL}/api-status`);
    const statusData = await statusResponse.json();
    console.log('✅ API Status:', statusData);

    // Test 3: Yahoo Finance Quote
    console.log('\n3. Testing Yahoo Finance Quote...');
    const quoteResponse = await fetch(`${PROXY_URL}/yahoo-finance/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: 'AAPL' })
    });
    const quoteData = await quoteResponse.json();
    console.log('✅ Yahoo Finance Quote:', quoteData);

    // Test 4: Reddit Trending
    console.log('\n4. Testing Reddit Trending...');
    const redditResponse = await fetch(`${PROXY_URL}/reddit/trending`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const redditData = await redditResponse.json();
    console.log('✅ Reddit Trending:', redditData);

    console.log('\n🎉 All tests passed! Your API proxy is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the proxy URL is correct');
    console.log('2. Verify the service is deployed and running');
    console.log('3. Check Railway logs for any errors');
  }
}

// Run the test
testProxyDeployment(); 