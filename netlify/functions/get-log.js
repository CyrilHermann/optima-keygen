// netlify/functions/get-log.js
const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  const filePath = path.join(__dirname, "../../log.json");

  if (!fs.existsSync(filePath)) {
    return {
      statusCode: 404,
      body: "Aucun fichier log disponible."
    };
  }

  const logData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const headers = ["timestamp", "login", "reason", "line", "inputCode", "generatedCode"];
  const csv = [headers.join(",")].concat(
    logData.map(entry => headers.map(h => entry[h]).join(","))
  ).join("\n");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=log.csv"
    },
    body: csv
  };
};
