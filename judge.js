// judge.js
const axios = require("axios");

const sendToJudge0 = async (sourceCode) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    data: {
      language_id: 63, // JavaScript (Node.js) — так как HTML напрямую не выполняется
      source_code: sourceCode,
      stdin: "",
    },
  };

  const submission = await axios.request(options);
  const token = submission.data.token;

  // Подождём немного перед проверкой результата
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = await axios.get(
    `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`,
    { headers: options.headers }
  );

  return result.data;
};

module.exports = { sendToJudge0 };
