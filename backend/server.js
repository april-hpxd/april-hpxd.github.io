const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('../frontend'));

app.get('/api/info', (req, res) => {
  res.json({ message: 'Portfolio backend running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
