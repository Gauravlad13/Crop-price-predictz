const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the frontend build directory
const staticPath = path.join(__dirname, '../build');
app.use(express.static(staticPath));

// Route everything to the frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Use Vercel environment port if available, otherwise default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
