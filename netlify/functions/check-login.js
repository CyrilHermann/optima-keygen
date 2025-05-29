const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { login, password } = JSON.parse(event.body);
  const filePath = path.join(__dirname, "login.csv");

  if (!fs.existsSync(filePath)) {
    return { statusCode: 500, body: "login.csv file not found" };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n").slice(1);

  for (const line of lines) {
    const [storedLogin, storedPassword, role] = line.split(",");
    if (storedLogin === login && storedPassword === password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, role })
      };
    }
  }

  return { statusCode: 200, body: JSON.stringify({ valid: false }) };
};