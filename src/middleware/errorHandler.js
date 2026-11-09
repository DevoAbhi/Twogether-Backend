export function errorHandler(err, req, res, next) {
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: err.issues[0]?.message || 'Invalid request' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate request' });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}
