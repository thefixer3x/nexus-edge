import express from 'express';
import aiRoutes from './ai.routes';

const app = express();
app.use(express.json());

// Mount AI routes
app.use(aiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Backend API is running.');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
