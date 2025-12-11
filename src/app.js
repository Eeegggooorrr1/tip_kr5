const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const colorRoutes = require('./routes/colorRoutes');
const paletteRoutes = require('./routes/paletteRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/api/color', colorRoutes);
app.use('/api/palettes', paletteRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
