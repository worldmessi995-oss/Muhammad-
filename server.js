const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// എല്ലാ ഭാഗത്തുനിന്നുമുള്ള കണക്ഷൻ അനുവദിക്കാൻ CORS ഉപയോഗിക്കുന്നു
app.use(cors());
app.use(express.json());

// പബ്ലിക് ഫോൾഡറിലെ ഫ്രണ്ട് എൻഡ് ഫയലുകൾ സെർവ് ചെയ്യാൻ
app.use(express.static(path.join(__dirname)));

const API_KEY = process.env.APISPORTS_KEY;
// 403 എറർ മാറാൻ ഔദ്യോഗിക API എൻഡ്പോയിന്റ് നേരിട്ട് ഉപയോഗിക്കുന്നു
const BASE_URL = 'https://api-sports.io';

// 1. Live Matches Route
app.get('/api/live', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/fixtures?live=all`, {
            headers: {
                'x-apisports-key': API_KEY
            }
        });
        
        // എപിഐ തരുന്ന എറർ എന്താണെന്ന് Render ലോഗ്സിൽ വ്യക്തമായി കാണാൻ വേണ്ടി
        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
            console.error("API-Sports Specific Error:", response.data.errors);
            return res.status(400).json({ error: response.data.errors });
        }
        
        res.json(response.data);
    } catch (error) {
        console.error("Live API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. Fixtures & Results Route by Date
app.get('/api/fixtures', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date query parameter is required' });
    
    try {
        const response = await axios.get(`${BASE_URL}/fixtures?date=${date}`, {
            headers: {
                'x-apisports-key': API_KEY
            }
        });

        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
            console.error("API-Sports Specific Error:", response.data.errors);
            return res.status(400).json({ error: response.data.errors });
        }

        res.json(response.data);
    } catch (error) {
        console.error("Fixtures API Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 3. Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'GOALZONE server running perfectly' });
});

// Render പ്ലാറ്റ്‌ഫോമിന് ആവശ്യമായ പോർട്ട് ക്രമീകരണം
const PORT = process.env.PORT || 10003;
app.listen(PORT, () => {
    console.log(`GOALZONE running on port ${PORT}`);
});
            
