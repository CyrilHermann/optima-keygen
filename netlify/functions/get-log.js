// netlify/functions/get-log.js
const fs = require("fs");
const path = require("path");
const exceljs = require("exceljs");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { login, password } = JSON.parse(event.body);
  const loginPath = path.join(__dirname, "..", "..", "login.csv");
  const logPath = path.join(__dirname, "..", "..", "log.csv");

  try {
    // Vérification du rôle admin
    const loginFile = fs.readFileSync(loginPath, "utf8");
    const lines = loginFile.trim().split("\n");
    let authorized = false;
    for (let i = 1; i < lines.length; i++) {
      const [user, pass, role] = lines[i].split(",");
      if (
        user.trim().toLowerCase() === login.trim().toLowerCase() &&
        pass.trim() === password.trim() &&
        role.trim().toLowerCase() === "admin"
      ) {
        authorized = true;
        break;
      }
    }

    if (!authorized) {
      return {
        statusCode: 401,
        body: "Unauthorized"
      };
    }

    // Lire le fichier log.csv et générer un fichier Excel
    const logData = fs.readFileSync(logPath, "utf8");
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("Logs");
    const rows = logData.trim().split("\n").map(line => line.split(","));

    sheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=log.xlsx"
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Erreur serveur: ${err.message}`
    };
  }
};
