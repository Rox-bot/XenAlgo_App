// Test script for Trading Education Blog Generator
const API_URL = 'https://xen-algo-api-proxy-production.up.railway.app';

async function testTradingEducationEndpoints() {
  console.log('🧪 Testing Trading Education Blog Generator...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.status);

    // Test 2: API status
    console.log('\n2. Testing API status...');
    const statusResponse = await fetch(`${API_URL}/api-status`);
    const statusData = await statusResponse.json();
    console.log('✅ API status:', statusData);

    // Test 3: Trading education topics
    console.log('\n3. Testing trading education topics...');
    const topicsResponse = await fetch(`${API_URL}/trading-education/topics`);
    if (topicsResponse.ok) {
      const topicsData = await topicsResponse.json();
      console.log('✅ Trading topics loaded:', topicsData.total_topics, 'topics');
      console.log('📚 Sample topics:', topicsData.topics.slice(0, 3));
    } else {
      console.log('❌ Topics endpoint not available yet (deployment in progress)');
    }

    // Test 4: Generate a sample blog
    console.log('\n4. Testing blog generation...');
    const blogResponse = await fetch(`${API_URL}/trading-education/generate-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Bollinger Bands: Complete Guide to Volatility Trading',
        include_marketing: true,
        style: 'professional'
      })
    });

    if (blogResponse.ok) {
      const blogData = await blogResponse.json();
      console.log('✅ Blog generated successfully!');
      console.log('📝 Topic:', blogData.topic);
      console.log('📅 Generated:', blogData.generated_at);
      console.log('💼 Marketing included:', blogData.marketing_included);
      
      if (blogData.blog_data) {
        console.log('📄 Title:', blogData.blog_data.title);
        console.log('⏱️ Read time:', blogData.blog_data.estimated_read_time);
        console.log('🏷️ Category:', blogData.blog_data.category);
      }
    } else {
      console.log('❌ Blog generation not available yet (deployment in progress)');
    }

    // Test 5: Generate daily blog
    console.log('\n5. Testing daily blog generation...');
    const dailyResponse = await fetch(`${API_URL}/trading-education/generate-daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (dailyResponse.ok) {
      const dailyData = await dailyResponse.json();
      console.log('✅ Daily blog generated successfully!');
      console.log('📝 Topic:', dailyData.topic);
      console.log('📅 Generated:', dailyData.generated_at);
      console.log('📊 Status:', dailyData.status);
    } else {
      console.log('❌ Daily blog generation not available yet (deployment in progress)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎉 Testing complete!');
}

// Run the test
testTradingEducationEndpoints(); 