const axios = require("axios");

const API_KEY = "94bc138fe4msh270578b0d824c6bp1f0351jsn00d14b8ae2d6"; // замени на свой

const submitJS = async () => {
  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*",
      {
        language_id: 63, // JavaScript (Node.js)
        source_code: `console.log("Привет из JavaScript!");`,
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const token = response.data.token;
    console.log("✅ Код отправлен. Token:", token);
    setTimeout(() => getResult(token), 3000);
  } catch (error) {
    console.error("❌ Ошибка при отправке кода:", error.response?.data || error.message);
  }
};

const getResult = async (token) => {
  try {
    const result = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    console.log("📥 Результат выполнения:");
    console.log(result.data.stdout || result.data.stderr || "Нет вывода");
  } catch (error) {
    console.error("❌ Ошибка при получении результата:", error.response?.data || error.message);
  }
};

submitJS();
