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

    // Création d’un fichier Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Logs");

    // En-têtes
    const headers = ["timestamp", "login", "reason", "line", "inputCode", "generatedCode"];
    sheet.addRow(headers);

    // Remplir avec les enregistrements
    data.records.forEach(record => {
      const fields = record.fields;
      const row = headers.map(h => fields[h] || "");
      sheet.addRow(row);
    });

    // Générer le fichier Excel en mémoire
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
      body: JSON.stringify({ error: err.message })
    };
  }
};
