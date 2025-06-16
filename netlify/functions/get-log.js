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

    const { records } = await airtableResponse.json();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Logs");

    const columns = ["timestamp", "login", "reason", "line", "inputCode", "generatedCode"];
    sheet.addRow(columns);

    records.forEach(record => {
      const row = columns.map(col => record.fields[col] || "");
      sheet.addRow(row);
    });

    // ⚠️ IMPORTANT : créer un Buffer correctement encodé
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
