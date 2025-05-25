const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { login, reason, line, inputCode, generatedCode } = JSON.parse(event.body);
  const filePath = path.join(__dirname, "../../log.json");

  let log = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    log = JSON.parse(content);
  }

  log.push({
    timestamp: new Date().toISOString(),
    login,
    reason,
    line,
    inputCode,
    generatedCode
  });

  fs.writeFileSync(filePath, JSON.stringify(log, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Log saved." })
  };
};
