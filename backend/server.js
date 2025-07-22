require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const path = require('path');
const { getAiRecommendation } = require('./ai-service');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/api/get-build-recommendation', async (req, res) => {
    try {
        const result = await getAiRecommendation(req.body);
        console.log("--- SENDING TO FRONTEND ---");
        console.log(JSON.stringify(result, null, 2));
        console.log("---------------------------");
        res.json(result);
    } catch (error) {
        console.error('Error getting AI recommendation:', error);
        res.status(500).json({ error: 'Failed to get recommendations from AI service.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;