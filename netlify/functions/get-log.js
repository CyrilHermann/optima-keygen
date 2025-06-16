const fs = require("fs");
const path = require("path");

exports.handler = async function () {
  try {
    const filePath = path.join(__dirname, "..", "..", "log.xlsx");
    const fileBuffer = fs.readFileSync(filePath);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=log.xlsx"
      },
      body: fileBuffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Impossible de lire le fichier log." })
    };
  }
};
