// GOALZONE — Football live scores, fixtures and results
// API key stays on the server. Requires Node.js 18+.
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.APISPORTS_KEY;
const cache = new Map();

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

async function footballApi(endpoint, cacheKey, ttlMs) {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < ttlMs) return cached.data;

  if (!API_KEY) {
    const error = new Error("Football data API key is not configured.");
    error.status = 503;
    throw error;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: { "x-apisports-key": API_KEY }
  });
  const data = await response.json();

  if (!response.ok || (data.errors && Object.keys(data.errors).length)) {
    const error = new Error("The football data provider returned an error.");
    error.status = response.status || 502;
    error.details = data.errors || data;
    throw error;
  }

  cache.set(cacheKey, { time: Date.now(), data });
  return data;
}

function sendError(res, error) {
  console.error(error.message, error.details || "");
  res.status(error.status || 502).json({
    error: error.message || "Unable to retrieve football data.",
    details: error.details || undefined
  });
}

app.get("/api/live", async (_req, res) => {
  try {
    const data = await footballApi("/fixtures?live=all&timezone=Asia%2FKolkata", "live", 25000);
    res.json(data);
  } catch (error) { sendError(res, error); }
});

app.get("/api/fixtures", async (req, res) => {
  const date = req.query.date;
  if (!validDate(date)) return res.status(400).json({ error: "Use date format YYYY-MM-DD." });
  try {
    const data = await footballApi(
      `/fixtures?date=${encodeURIComponent(date)}&timezone=Asia%2FKolkata`,
      `fixtures:${date}`, 180000
    );
    res.json(data);
  } catch (error) { sendError(res, error); }
});

app.get("/api/results", async (req, res) => {
  const date = req.query.date;
  if (!validDate(date)) return res.status(400).json({ error: "Use date format YYYY-MM-DD." });
  try {
    const data = await footballApi(
      `/fixtures?date=${encodeURIComponent(date)}&timezone=Asia%2FKolkata`,
      `results:${date}`, 180000
    );
    const finished = new Set(["FT", "AET", "PEN"]);
    res.json({
      ...data,
      response: (data.response || []).filter(item => finished.has(item.fixture?.status?.short))
    });
  } catch (error) { sendError(res, error); }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "GOALZONE", apiKeyConfigured: Boolean(API_KEY) });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GOALZONE running on http://localhost:${port}`));
