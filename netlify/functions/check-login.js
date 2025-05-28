
const fs = require("fs");
const path = require("path");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { login, password } = JSON.parse(event.body);
  const filePath = path.join(__dirname, "login.csv");

  try {
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 404,
        body: "login.csv file not found"
      };
    }

    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.trim().split("\n");
    for (let i = 1; i < lines.length; i++) {
      const [csvLogin, csvPassword] = lines[i].split(",");
      if (
        csvLogin.trim().toLowerCase() === login.trim().toLowerCase() &&
        csvPassword.trim() === password.trim()
      ) {
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true })
        };
      }
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  } catch (err) {
    console.error("Erreur lecture login.csv :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server Error", detail: err.message })
    };
  }
};


