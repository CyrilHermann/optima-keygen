// netlify/functions/get-log.js
const fetch = require("node-fetch");

exports.handler = async function () {
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
  const rows = data.records.map(record => {
    const fields = record.fields;
    const ts = fields.timestamp ? new Date(fields.timestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Paris"
    }) : "";

    return [
      ts,
      fields.login || "",
      fields.reason || "",
      fields.line || "",
      fields.inputCode || "",
      fields.generatedCode || ""
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": "attachment; filename=log_optima.csv"
    },
    body: csv
  };
};
