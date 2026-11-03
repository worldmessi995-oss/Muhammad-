// GOALZONE backend — Node.js + Express
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 1. ലൈവ് മത്സരങ്ങൾക്കുള്ള API റൂട്ട്
app.get("/api/live", async (req, res) => {
  const key = process.env.APISPORTS_KEY;
  if (!key) return res.status(503).json({ error: "API key not configured" });

  try {
    const response = await fetch("https://api-sports.io", {
      headers: { "x-apisports-key": key }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch live matches" });
  }
});

// 2. വരാനിരിക്കുന്ന മത്സരങ്ങൾക്കുള്ള API റൂട്ട് (അടുത്ത 7 ദിവസത്തെ മത്സരങ്ങൾ)
app.get("/api/fixtures", async (req, res) => {
  const key = process.env.APISPORTS_KEY;
  if (!key) return res.status(503).json({ error: "API key not configured" });

  // ഇന്നത്തെ തീയതിയും അടുത്ത 7 ദിവസത്തെ തീയതിയും കണക്കാക്കുന്നു (YYYY-MM-DD)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const formatDate = (date) => date.toISOString().split('T')[0];

  try {
    const response = await fetch(`https://api-sports.io{formatDate(today)}&to=${formatDate(nextWeek)}`, {
      headers: { "x-apisports-key": key }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch upcoming fixtures" });
  }
});

app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GOALZONE running on port ${port}`));
