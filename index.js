
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static('public'));

// health
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// routes
const recommendationsRouter = require('./routes/recommendations');
app.use(recommendationsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
