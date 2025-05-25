// netlify/functions/get-log.js
const fetch = require("node-fetch");
const { stringify } = require("csv-stringify/sync");

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
  const records = data.records.map(record => {
    const fields = record.fields;
    const ts = fields.timestamp ? new Date(fields.timestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Paris"
    }) : "";

    return {
      timestamp: ts,
      login: fields.login || "",
      reason: fields.reason || "",
      line: fields.line || "",
      inputCode: fields.inputCode || "",
      generatedCode: fields.generatedCode || ""
    };
  });

  const xlsxFormatted = stringify(records, { header: true, columns: headers, delimiter: "," });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=log_optima.xlsx"
    },
    body: xlsxFormatted
  };
};
