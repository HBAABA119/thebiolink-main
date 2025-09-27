// scripts/test-login-api.js
// Use built-in fetch instead of node-fetch

async function testLoginAPI() {
  console.log('Testing login API directly...');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aayan.b.asim@gmail.com',
        password: 'testpassword' // Replace with actual password if known
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testLoginAPI();