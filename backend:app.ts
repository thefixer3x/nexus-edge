import express from 'express';
import aiRoutes from './ai.routes';

const app = express();
app.use(express.json());

// Mount the AI routes
app.use(aiRoutes);

// (Optional) Add other routes here

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});