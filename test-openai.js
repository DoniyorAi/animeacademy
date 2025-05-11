// ---- test-openai.js ----
require('dotenv').config();            // 1) Загрузка .env
const fs = require('fs');

// Диагностика:
console.log('1) Текущая рабочая папка:', process.cwd());
console.log('2) Есть ли в ней .env?', fs.existsSync('.env'));
console.log('3) Содержимое папки:', fs.readdirSync(process.cwd()));
console.log('4) Значение OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

// Тест к OpenAI:
if (process.env.OPENAI_API_KEY) {
  const fetch = require('node-fetch');
  fetch("https://api.openai.com/v1/models", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => console.log('5) Ответ от OpenAI:', data))
    .catch(err => console.error('5) Ошибка запроса:', err));
} else {
  console.error('❌ Переменная OPENAI_API_KEY не найдена, дальше тест не идёт.');
}
