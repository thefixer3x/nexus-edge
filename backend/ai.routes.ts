import express from 'express';
const router = express.Router();

router.post('/api/ai/setting-suggestion', async (req, res) => {
  const { userId } = req.body;
  res.json({ suggestion: `Hello user ${userId}, here is your AI setting suggestion!` });
});

export default router;
