require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

if (!Configuration || !OpenAIApi) {
  console.error("Не удалось загрузить Configuration или OpenAIApi из openai.");
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function checkAnswer(question, correctAnswer, studentAnswer) {
  const prompt = `Оцени ответ студента по заданию.
Вопрос: "${question}".
Правильный ответ: "${correctAnswer}".
Ответ студента: "${studentAnswer}".
Оцени корректность ответа по шкале от 0 до 100, где 100 – ответ полностью правильный, а 0 – неправильный.`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 60,
      temperature: 0,
    });
    const responseText = completion.data.choices[0].text;
    const gradeMatch = responseText.match(/\d+/);
    const grade = gradeMatch ? parseInt(gradeMatch[0], 10) : 0;
    return grade;
  } catch (error) {
    console.error("Ошибка проверки ответа:", error);
    return 0;
  }
}

module.exports = { checkAnswer };
