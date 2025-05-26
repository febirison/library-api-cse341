// Description: Main server file for Anderson Okai's Library Management API
  const express = require('express');
  const mongoose = require('mongoose');
  const bookRoutes = require('./routes/books');
  const memberRoutes = require('./routes/members');
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');

  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware to parse JSON requests
  app.use(express.json());

  // Swagger UI setup for API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Root route
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Anderson Okai\'s Library Management API' });
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
  mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1); // Exit if DB connection fails
    });

  // Start server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });