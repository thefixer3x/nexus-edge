import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3006; // Unique port for Search Service

// Placeholder Endpoints for Search Service
app.get('/api/search/products', (req, res) => {
  const query = req.query.q || '';
  console.log(`Search request for products with query: "${query}"`);
  res.status(200).send([
    { id: 'search-prod1', name: `Searched Product A for "${query}"`, price: 10.00 },
    { id: 'search-prod2', name: `Searched Product B for "${query}"`, price: 20.00 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Search Service running on port ${PORT}`);
});