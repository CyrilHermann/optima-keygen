const fetch = require("node-fetch");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = "appFcQRj7VbUyVJW3";
  const tableName = "logs";

  const { login, reason, line, inputCode, generatedCode } = JSON.parse(event.body);
  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  const response = await fetch(airtableUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        timestamp: new Date().toISOString(),
        login,
        reason,
        line,
        inputCode,
        generatedCode
      }
    })
  });

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: `Erreur Airtable: ${await response.text()}`
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "✅ Données enregistrées dans Airtable" })
  };
};