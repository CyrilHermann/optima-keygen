const fetch = require("node-fetch");
const ExcelJS = require("exceljs");

exports.handler = async function () {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = "appFcQRj7VbUyVJW3";
  const tableName = "logs";

  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!data.records || !Array.isArray(data.records)) {
      throw new Error("Réponse invalide d'Airtable");
    }

    // Crée un fichier Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Logs");

    const headers = ["timestamp", "login", "reason", "line", "inputCode", "generatedCode"];
    sheet.addRow(headers);

    data.records.forEach(record => {
      const row = headers.map(h => record.fields[h] || "");
      sheet.addRow(row);
    });

    // Buffer binaire à encoder en base64
    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = buffer.toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=log.xlsx"
      },
      body: base64,
      isBase64Encoded: true
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
