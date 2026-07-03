const express = require('express');
const app = express();
const PORT = 3000;

// serve the static site from the repo root (index.html, style.css, script.js, assets/)
app.use(express.static(require('path').join(__dirname, '..')));

app.get('/api/info', (req, res) => {
  res.json({ message: 'Portfolio backend running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
