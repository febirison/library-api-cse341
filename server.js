// Description: Main server file for Anderson Okai's Library Management API
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'D:/library-api-cse341/.env' });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

const passport = require('./config/passport');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI setup for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Anderson Okai\'s Library Management API' });
});

// Authentication routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id, username: req.user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, isAuthenticated: true });
  } else {
    res.json({ user: null, isAuthenticated: false });
  }
});

// Mount routes
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.set('strictQuery', true); // Suppress deprecation warning
mongoose.connect(mongoUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});