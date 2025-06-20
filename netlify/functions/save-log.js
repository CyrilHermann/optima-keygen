const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée" })
    };
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = "appFcQRj7VbUyVJW3";
  const tableName = "logs";

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Requête JSON invalide" })
    };
  }

  let { login, reason, line, inputCode, generatedCode } = payload;
  line = line.toUpperCase();

  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  try {
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

    const responseText = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Erreur Airtable: ${responseText}` })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "✅ Données enregistrées dans Airtable" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Erreur serveur: ${err.message}` })
    };
  }
};
