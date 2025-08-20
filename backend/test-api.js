// Simple test script to test backend API endpoints
const fetch = require('node-fetch'); // You may need to install node-fetch

const API_URL = 'http://localhost:5001/api';

// Test user registration
async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const userData = {
      email: 'test@example.com',
      password: 'Test@123456',
      role: 'doctor',
      firstName: 'Dr. Test',
      lastName: 'User',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        zipCode: '400001'
      }
    };

    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log('Registration Response:', data);
    
    if (data.success) {
      console.log('✅ Registration successful!');
      return data.token;
    } else {
      console.log('❌ Registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return null;
  }
}

// Test user login
async function testLogin() {
  try {
    console.log('\nTesting user login...');
    
    const loginData = {
      email: 'test@example.com',
      password: 'Test@123456'
    };

    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    console.log('Login Response:', data);
    
    if (data.success) {
      console.log('✅ Login successful!');
      return data.token;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

// Test profile fetch
async function testProfileFetch(token) {
  try {
    console.log('\nTesting profile fetch...');
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Profile Response:', data);
    
    if (data.success) {
      console.log('✅ Profile fetch successful!');
      return data.user;
    } else {
      console.log('❌ Profile fetch failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Profile fetch error:', error.message);
    return null;
  }
}

// Test profile update
async function testProfileUpdate(token) {
  try {
    console.log('\nTesting profile update...');
    
    const updateData = {
      doctorInfo: {
        specialization: 'Cardiology',
        experience: '10 years',
        credentials: 'MBBS, MD (Cardiology)'
      }
    };

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    console.log('Profile Update Response:', data);
    
    if (data.success) {
      console.log('✅ Profile update successful!');
      return data.user;
    } else {
      console.log('❌ Profile update failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Profile update error:', error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test registration
  let token = await testRegistration();
  
  if (!token) {
    // If registration fails, try login
    token = await testLogin();
  }
  
  if (token) {
    // Test profile operations
    await testProfileFetch(token);
    await testProfileUpdate(token);
    await testProfileFetch(token); // Fetch again to see updates
  }
  
  console.log('\n🏁 Tests completed!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    const data = await response.json();
    if (data.status === 'OK') {
      console.log('✅ Backend server is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Backend server is not running. Please start the server first.');
    return false;
  }
}

// Run the tests
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main();
