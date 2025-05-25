const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  const filePath = path.join(__dirname, "../../log.csv");
  if (!fs.existsSync(filePath)) return { statusCode: 404, body: "Fichier log non trouvé." };
  const content = fs.readFileSync(filePath, "utf8");
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=log.csv"
    },
    body: content
  };
};