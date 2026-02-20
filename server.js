const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hello World</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #0f0f0f;
          color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .card {
          text-align: center;
          padding: 3rem 4rem;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          background: #1a1a1a;
        }
        h1 { font-size: 3rem; margin-bottom: 0.5rem; }
        p { color: #888; font-size: 1.1rem; }
        .badge {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.3rem 0.8rem;
          background: #7c3aed;
          border-radius: 999px;
          font-size: 0.8rem;
          color: #fff;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Hello, World!</h1>
        <p>Built with Node.js + Express</p>
        <span class="badge">Deployed on Railway</span>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
