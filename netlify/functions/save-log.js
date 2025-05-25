const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  const data = JSON.parse(event.body);
  const { login, reason, line, inputCode, generatedCode } = data;
  const filePath = path.join(__dirname, "../../log.csv");
  const entry = `\n${new Date().toISOString()},${login},${reason},${line},${inputCode},${generatedCode}`;
  fs.appendFileSync(filePath, entry);
  return { statusCode: 200, body: "OK" };
};