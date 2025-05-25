// netlify/functions/get-log.js
const fetch = require("node-fetch");

exports.handler = async function() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = "appFcQRj7VbUyVJW3";
  const tableName = "logs";

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  const response = await fetch(airtableUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: `Erreur lors de la lecture: ${await response.text()}`
    };
  }

  const data = await response.json();

  const headers = ["timestamp", "login", "reason", "line", "inputCode", "generatedCode"];
  const rows = data.records.map(r => headers.map(h => r.fields[h] || "").join(","));
  const csv = [headers.join(","), ...rows].join("\n");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=log.csv"
    },
    body: csv
  };
};
