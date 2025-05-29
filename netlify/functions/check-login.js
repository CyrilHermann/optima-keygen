const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let login, password;
  try {
    ({ login, password } = JSON.parse(event.body));
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Requête invalide (JSON)' })
    };
  }

  try {
    const filePath = path.join(__dirname, '..', '..', 'login.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const rows = fileContent.trim().split('\n').map(row => row.split(','));
    const headers = rows[0];
    const users = rows.slice(1);

    const loginIndex = headers.indexOf('login');
    const passIndex = headers.indexOf('password');
    const roleIndex = headers.indexOf('role');

    const user = users.find(row =>
      row[loginIndex].trim().toLowerCase() === login.toLowerCase() &&
      row[passIndex].trim() === password
    );

    if (user) {
      const role = user[roleIndex];
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, role })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: false })
      };
    }

  } catch (err) {
    console.error("Erreur lecture login.csv :", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur : impossible de lire login.csv" })
    };
  }
};
