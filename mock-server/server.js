const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const frontendOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(',')
  : [
      'http://localhost:4200',
      'http://localhost:4300',
      'http://localhost:4400',
      'http://localhost:4500',
    ];

app.use(
  cors({
    origin: frontendOrigins,
    credentials: true,
  })
);

app.use(express.json());

// In-memory storage (replace with database in production)
const users = [
  {
    userId: '1',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    fullName: 'System Admin',
    roleId: '1',
    role: { roleId: '1', roleName: 'Admin' },
    status: 'Verified',
  },
  {
    userId: '2',
    email: 'student@example.com',
    password: bcrypt.hashSync('student123', 10),
    fullName: 'John Student',
    roleId: '2',
    role: { roleId: '2', roleName: 'Student' },
    status: 'Verified',
  },
  {
    userId: '3',
    email: 'recruiter@example.com',
    password: bcrypt.hashSync('recruiter123', 10),
    fullName: 'Jane Recruiter',
    roleId: '3',
    role: { roleId: '3', roleName: 'Recruiter' },
    status: 'Verified',
  },
];

const sessions = new Map(); // sessionId -> session data
const ssoAuthTokens = new Map(); // sso_auth -> token data
const refreshTokens = new Map(); // refreshToken -> userId

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });
const verifyToken = (token, secret) => jwt.verify(token, secret);

// Cleanup expired tokens and sessions
const cleanup = () => {
  const now = Date.now();

  // Cleanup expired sessions
  for (const [sessionId, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId);
    }
  }

  // Cleanup expired SSO auth tokens
  for (const [ssoAuth, tokenData] of ssoAuthTokens) {
    if (tokenData.expiresAt < now) {
      ssoAuthTokens.delete(ssoAuth);
    }
  }
};

// Run cleanup every minute
setInterval(cleanup, 60000);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Routes

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'Verified') {
      return res.status(401).json({ error: 'Account not verified' });
    }

    // Create session
    const sessionId = generateId();
    const accessToken = generateToken(
      { userId: user.userId, email: user.email, roleId: user.roleId },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );
    const refreshToken = generateId();

    const sessionData = {
      sessionId,
      userId: user.userId,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId,
        role: user.role,
        status: user.status,
      },
      tokens: { accessToken, refreshToken },
      createdAt: Date.now(),
      expiresAt: Date.now() + parseInt(process.env.SESSION_TTL || '3600000'),
    };

    sessions.set(sessionId, sessionData);
    refreshTokens.set(refreshToken, user.userId);

    // Create single-use SSO auth token
    const ssoAuth = generateId();
    const ssoAuthData = {
      sso_auth: ssoAuth,
      sessionId,
      createdAt: Date.now(),
      expiresAt: Date.now() + parseInt(process.env.SSO_AUTH_TTL || '60000'),
      used: false,
    };
    ssoAuthTokens.set(ssoAuth, ssoAuthData);

    res.json({
      user: sessionData.user,
      tokens: sessionData.tokens,
      sessionId,
      sso_auth: ssoAuth,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, roleId } = req.body;

    if (!email || !password || !fullName || !roleId) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId();
    const roleName =
      roleId === '1' ? 'Admin' : roleId === '2' ? 'Student' : 'Recruiter';

    const newUser = {
      userId,
      email,
      password: hashedPassword,
      fullName,
      roleId,
      role: { roleId, roleName },
      status: 'Verified', // Auto-verify for demo
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        userId: newUser.userId,
        email: newUser.email,
        fullName: newUser.fullName,
        roleId: newUser.roleId,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/verify-session
app.post('/api/auth/verify-session', (req, res) => {
  try {
    const { sso_auth, sessionId } = req.body;

    if (!sso_auth && !sessionId) {
      return res.status(400).json({ error: 'sso_auth or sessionId required' });
    }

    let session;

    if (sso_auth) {
      // Verify SSO auth token
      const ssoAuthData = ssoAuthTokens.get(sso_auth);
      if (!ssoAuthData) {
        return res.status(401).json({ error: 'Invalid SSO auth token' });
      }

      if (ssoAuthData.used) {
        return res.status(401).json({ error: 'SSO auth token already used' });
      }

      if (ssoAuthData.expiresAt < Date.now()) {
        ssoAuthTokens.delete(sso_auth);
        return res.status(401).json({ error: 'SSO auth token expired' });
      }

      // Mark as used and get session
      ssoAuthData.used = true;
      session = sessions.get(ssoAuthData.sessionId);
    } else if (sessionId) {
      // Direct session verification
      session = sessions.get(sessionId);
    }

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    if (session.expiresAt < Date.now()) {
      sessions.delete(session.sessionId);
      return res.status(401).json({ error: 'Session expired' });
    }

    // Generate new access token for this verification
    const newAccessToken = generateToken(
      {
        userId: session.userId,
        email: session.user.email,
        roleId: session.user.roleId,
      },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: session.tokens.refreshToken,
      user: session.user,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const userId = refreshTokens.get(refreshToken);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = users.find((u) => u.userId === userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = generateToken(
      { userId: user.userId, email: user.email, roleId: user.roleId },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );
    const newRefreshToken = generateId();

    // Update refresh token mapping
    refreshTokens.delete(refreshToken);
    refreshTokens.set(newRefreshToken, userId);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.userId === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  try {
    const { sessionId, refreshToken } = req.body;

    if (sessionId) {
      sessions.delete(sessionId);
    }

    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    sessions: sessions.size,
    ssoTokens: ssoAuthTokens.size,
    refreshTokens: refreshTokens.size,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${frontendOrigins.join(', ')}`);
  console.log('Test accounts:');
  console.log('  Admin: admin@example.com / admin123');
  console.log('  Student: student@example.com / student123');
  console.log('  Recruiter: recruiter@example.com / recruiter123');
});

module.exports = app;
