GOALZONE — FULL LIVE FOOTBALL WEBSITE

FEATURES
- Real live scores from API-FOOTBALL
- Upcoming fixtures by selected date
- Completed match results by selected date
- Mobile-friendly responsive layout
- Automatic live-score refresh every 30 seconds
- API key stored on the server, never in public HTML

IMPORTANT
This project is prepared for real data, but it will NOT show live scores until you add your own API-FOOTBALL key and deploy/run the Node.js server. The API provider may have free/paid plans, coverage limits and request quotas. Check its current terms and coverage before use.

SETUP ON A COMPUTER
1. Install Node.js 18 or newer.
2. Extract this ZIP.
3. Open a terminal inside the GOALZONE folder.
4. Run: npm install
5. Copy .env.example to a new file named .env
6. Open .env and replace YOUR_API_KEY_HERE with your private API key.
7. Run: npm start
8. Open http://localhost:3000

PUBLISH ONLINE
Use a Node.js hosting provider that supports environment variables.
- Upload/deploy the GOALZONE project.
- Set environment variable APISPORTS_KEY to your private key.
- Set PORT only if your host requires it.
- Deploy, then open the public website URL.

PHONE-ONLY NOTE
You can view/edit public/index.html using a mobile code editor, but the live-score website needs the Node.js backend to run online. Opening index.html directly from your phone will not connect to the protected API routes. You need a Node.js host to publish it.

API ROUTES
- GET /api/live
- GET /api/fixtures?date=YYYY-MM-DD
- GET /api/results?date=YYYY-MM-DD
- GET /api/health

SECURITY
- Never put your API key in public/index.html.
- Never send your .env file or API key to anyone.
- Do not commit .env to a public repository.
