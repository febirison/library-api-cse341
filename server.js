// Description: Main server file for Library API
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Library Management API');
});

// Connect routes
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch(err => console.error('Mongoose connection error:', err));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});