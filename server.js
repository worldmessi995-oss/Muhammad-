// GOALZONE backend — Node.js + Express
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// public ഫോൾഡറിന് പകരം നേരിട്ട് ഫയലുകൾ കാണിക്കാൻ ഇത് സഹായിക്കും:
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/live", async (req, res) => {
  const key = process.env.APISPORTS_KEY;
  if (!key) return res.status(503).json({
    error: "API key not configured",
    message: "Add APISPORTS_KEY to the server .env file."
  });

  try {
    const response = await fetch("https://api-sports.io", {
      headers: { "x-apisports-key": key }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: "Football API request failed", details: data });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch live matches" });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, app: "GOALZONE" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GOALZONE running on port ${port}`));
