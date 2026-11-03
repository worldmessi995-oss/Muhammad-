// GOALZONE backend — Node.js + Express
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// 1. പ്രധാന ഹോം പേജ് കാണിക്കാനുള്ള റൂട്ട് (മറ്റെല്ലാത്തിനും മുൻപ് ഇത് വരണം)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 2. ലൈവ് മത്സരങ്ങളുടെ വിവരങ്ങൾ എടുക്കാനുള്ള API റൂട്ട്
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

// 3. ഹെൽത്ത് ചെക്ക് റൂട്ട്
app.get("/api/health", (req, res) => res.json({ ok: true, app: "GOALZONE" }));

// 4. ബാക്കിയുള്ള എല്ലാ സ്റ്റാറ്റിക് ഫയലുകളും (CSS, JS) കാണിക്കാൻ
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GOALZONE running on port ${port}`));
