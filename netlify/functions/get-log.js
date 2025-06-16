const fetch = require("node-fetch");
const ExcelJS = require("exceljs");

exports.handler = async function () {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = "appFcQRj7VbUyVJW3";
  const tableName = "logs";

  try {
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await airtableResponse.json();
    const records = data.records || [];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Optima App";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Logs");

    const headers = [
      { header: "Horodatage", key: "timestamp", width: 25 },
      { header: "Login", key: "login", width: 20 },
      { header: "Raison", key: "reason", width: 30 },
      { header: "Ligne", key: "line", width: 15 },
      { header: "Code Entré", key: "inputCode", width: 15 },
      { header: "Code Généré", key: "generatedCode", width: 15 }
    ];

    sheet.columns = headers;

    records.forEach(record => {
      const fields = record.fields || {};
      sheet.addRow({
        timestamp: fields.timestamp || "",
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
