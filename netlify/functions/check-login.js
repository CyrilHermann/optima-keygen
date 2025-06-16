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

    const user = users.find(row =>
      row[loginIndex].trim().toLowerCase() === login.toLowerCase() &&
      row[passIndex].trim() === password
    );

    if (user) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, role: user[roleIndex] })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false })
      };
    }
  } catch (error) {
    console.error("Erreur lecture login.csv :", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur : impossible de lire login.csv" })
    };
  }
};
