const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const API_KEY = process.env.APISPORTS_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// പ്രധാന ലീഗുകളുടെ IDs (Premier League, Champions League, La Liga)
const ALLOWED_LEAGUES = [39, 2, 140];

// 1. Live Matches Route
app.get('/api/live', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/fixtures?live=all`, {
            headers: { 'x-apisports-key': API_KEY }
        });
        
        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
            return res.status(400).json({ error: response.data.errors });
        }

        if (response.data.response) {
            response.data.response = response.data.response.filter(item => 
                ALLOWED_LEAGUES.includes(item.league.id)
            );
        }

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Fixtures By Date Route
app.get('/api/fixtures', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });
    
    try {
        const response = await axios.get(`${BASE_URL}/fixtures?date=${date}`, {
            headers: { 'x-apisports-key': API_KEY }
        });

        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
            return res.status(400).json({ error: response.data.errors });
        }

        if (response.data.response) {
            response.data.response = response.data.response.filter(item => 
                ALLOWED_LEAGUES.includes(item.league.id)
            );
        }

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10003;
app.listen(PORT, () => {
    console.log(`GOALZONE running on port ${PORT}`);
});
