const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée" })
    };
  }

  try {
    const filePath = path.join(__dirname, "..", "..", "secure", "login.csv");
    const csvData = fs.readFileSync(filePath, "utf8");

    const rows = csvData.trim().split("\n").map(row => row.split(","));
    const headers = rows[0];
    const users = rows.slice(1);

    const { login, password } = JSON.parse(event.body);

    const loginIndex = headers.indexOf("login");
    const passIndex = headers.indexOf("password");
    const roleIndex = headers.indexOf("role");

    // Vérifie si le login existe
    const userRow = users.find(row => row[loginIndex].trim().toLowerCase() === login.toLowerCase());

    if (!userRow) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, reason: "not-found" })
      };
    }

    // Vérifie si le mot de passe est correct
    if (userRow[passIndex].trim() !== password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false, reason: "wrong-password" })
      };
    }

    // OK
    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        role: userRow[roleIndex]
      })
    };

  } catch (error) {
    console.error("Erreur lecture login.csv :", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur : impossible de lire login.csv" })
    };
  }
};
