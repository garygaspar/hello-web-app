const { Client } = require("@notionhq/client");

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

module.exports = { getPosts };
