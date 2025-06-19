const fetch = require("node-fetch");
const ExcelJS = require("exceljs");

exports.handler = async function () {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = "appFcQRj7VbUyVJW3";
  const tableName = "logs";

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=100`;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  try {
    const res = await fetch(url, { headers });
    const airtableData = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: airtableData })
      };
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Logs");

    // En-têtes
    sheet.columns = [
      { header: "Timestamp", key: "timestamp", width: 22 },
      { header: "Login", key: "login", width: 20 },
      { header: "Reason", key: "reason", width: 30 },
      { header: "Line", key: "line", width: 15 },
      { header: "Input Code", key: "inputCode", width: 15 },
      { header: "Generated Code", key: "generatedCode", width: 18 }
    ];

    // Lignes
    airtableData.records.forEach(record => {
      const fields = record.fields;
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
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=log.xlsx"
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur", details: err.message })
    };
  }
};
