// netlify/functions/get-log.js
const fetch = require("node-fetch");
const ExcelJS = require("exceljs");

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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Logs");

  worksheet.columns = [
    { header: "Horodatage", key: "timestamp", width: 20 },
    { header: "Login", key: "login", width: 20 },
    { header: "Raison", key: "reason", width: 30 },
    { header: "Ligne", key: "line", width: 15 },
    { header: "Code Entré", key: "inputCode", width: 15 },
    { header: "Code Généré", key: "generatedCode", width: 15 }
  ];

  data.records.forEach(record => {
    const fields = record.fields;
    const ts = fields.timestamp ? new Date(fields.timestamp).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Paris"
    }) : "";

    worksheet.addRow({
      timestamp: ts,
      login: fields.login || "",
      reason: fields.reason || "",
      line: fields.line || "",
      inputCode: fields.inputCode || "",
      generatedCode: fields.generatedCode || ""
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=log_optima.xlsx"
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true
  };
};
