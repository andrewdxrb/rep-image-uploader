// Vercel serverless function for login
const users = {
  'admin': {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  'user': {
    id: '2',
    username: 'user', 
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
};

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }
  
  const user = users[email] || users[email.split('@')[0]];
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  const accessToken = `jwt_access_${user.id}_${Date.now()}`;
  const refreshToken = `jwt_refresh_${user.id}_${Date.now()}`;
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    }
  });
}