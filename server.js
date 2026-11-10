const { date } = req.query;
if (!date) return res.status(400).json({ error: 'Date is required' });
