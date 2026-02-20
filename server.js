const express = require("express");
const { Client } = require("@notionhq/client");

const app = express();
const PORT = process.env.PORT || 3000;

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function getPosts() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results.map((page) => ({
    title: page.properties.Title.title[0]?.plain_text || "Untitled",
    summary: page.properties.Summary.rich_text[0]?.plain_text || "",
    category: page.properties.Category.select?.name || "",
    date: page.properties.Date.date?.start || "",
  }));
}

const categoryColors = {
  Tech: "#3b82f6",
  Tutorial: "#22c55e",
  Lifestyle: "#f97316",
};

app.get("/", async (req, res) => {
  let posts = [];
  let error = null;

  try {
    posts = await getPosts();
  } catch (e) {
    error = e.message;
  }

  const postCards = posts
    .map((p) => {
      const color = categoryColors[p.category] || "#7c3aed";
      const dateStr = p.date
        ? new Date(p.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";
      return `
      <div class="card">
        <div class="meta">
          <span class="badge" style="background:${color}">${p.category}</span>
          <span class="date">${dateStr}</span>
        </div>
        <h2>${p.title}</h2>
        <p>${p.summary}</p>
      </div>`;
    })
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Blog Posts</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #0f0f0f;
          color: #f0f0f0;
          min-height: 100vh;
          padding: 3rem 1.5rem;
        }
        header {
          text-align: center;
          margin-bottom: 3rem;
        }
        header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        header p { color: #888; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 960px;
          margin: 0 auto;
        }
        .card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 1.5rem;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: #7c3aed; }
        .meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .badge {
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
        }
        .date { font-size: 0.8rem; color: #666; }
        h2 { font-size: 1.15rem; margin-bottom: 0.5rem; }
        p { color: #999; font-size: 0.9rem; line-height: 1.6; }
        .error {
          text-align: center;
          color: #f87171;
          background: #1a1a1a;
          border: 1px solid #3a1a1a;
          border-radius: 12px;
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Blog Posts</h1>
        <p>Powered by Notion</p>
      </header>
      ${
        error
          ? `<div class="error"><strong>Error:</strong> ${error}</div>`
          : `<div class="grid">${postCards || "<p style='text-align:center;color:#666'>No posts found.</p>"}</div>`
      }
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
