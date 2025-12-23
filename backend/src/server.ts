import express from 'express';
import cors from 'cors';
import recipesRouter from './routes/recipes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/recipes', recipesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recipe Finder API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api/recipes`);
});
