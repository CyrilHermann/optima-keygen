
exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { inputCode } = JSON.parse(event.body);
  if (!inputCode || typeof inputCode !== "number") {
    return {
      statusCode: 400,
      body: "Invalid input code"
    };
  }

  let diCode = inputCode;
  let diCode1 = 0;
  let diCode2 = 0;
  let diKey = 191160;

  diCode2 = diCode - 82147;
  diCode1 = diCode2 + 345678;
  diCode2 = diCode2 + 987654;

  for (let i = 0; i < 6; i++) {
    switch (diCode1 % 17) {
      case 0: diKey ^= 10378468; break;
      case 1: diKey ^= 9756798; break;
      case 2: diKey ^= 11958733; break;
      case 3: diKey ^= 9941455; break;
      case 4: diKey ^= 3299378; break;
      case 5: diKey ^= 126389; break;
      case 6: diKey ^= 10410033; break;
      case 7: diKey ^= 14299171; break;
      case 8: diKey ^= 12396521; break;
      case 9: diKey ^= 2170442; break;
      case 10: diKey ^= 3392544; break;
      case 11: diKey ^= 12579906; break;
      case 12: diKey ^= 9106159; break;
      case 13: diKey ^= 9555089; break;
      case 14: diKey ^= 15305273; break;
      case 15: diKey ^= 768224; break;
      case 16: diKey ^= 15914241; break;
    }
    diCode1 = Math.floor(diCode1 / 17);

    switch (diCode2 % 19) {
      case 0: diKey ^= 5741148; break;
      case 1: diKey ^= 11035842; break;
      case 2: diKey ^= 4420135; break;
      case 3: diKey ^= 13056627; break;
      case 4: diKey ^= 11694283; break;
      case 5: diKey ^= 520152; break;
      case 6: diKey ^= 14277664; break;
      case 7: diKey ^= 4577628; break;
      case 8: diKey ^= 7053676; break;
      case 9: diKey ^= 13101311; break;
      case 10: diKey ^= 12275109; break;
      case 11: diKey ^= 15946162; break;
      case 12: diKey ^= 2133221; break;
      case 13: diKey ^= 2423934; break;
      case 14: diKey ^= 8896713; break;
      case 15: diKey ^= 4542915; break;
      case 16: diKey ^= 176056; break;
      case 17: diKey ^= 3255677; break;
      case 18: diKey ^= 2449672; break;
    }
    diCode2 = Math.floor(diCode2 / 19);
  }

  const generatedCode = 100000 + (diKey & 0x0fffffff) % 900000;

  return {
    statusCode: 200,
    body: JSON.stringify({ generatedCode })
  };
};
