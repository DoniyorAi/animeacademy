// aiChecker.js
require('dotenv').config();

const { OpenAI } = require('openai');  // импорт конструктора
const openai = new OpenAI({            // сразу передаём ключ
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Проверяет ответ студента по эталону через OpenAI.
 * Возвращает { correct: "Yes"|"No", feedback: string }.
 */
async function checkAnswer(question, correctAnswer, studentAnswer) {
  const prompt = `
У тебя задача:
1) Сравнить ответ студента с эталоном.
2) Сказать, правильно ли (Yes/No).
3) Если нет — кратко указать, что именно неверно.

ВОПРОС:
${question}

ЭТАЛОН:
${correctAnswer}

ОТВЕТ СТУДЕНТА:
${studentAnswer}

ДАЙ ОТВЕТ В ФОРМАТЕ JSON:
{
  "correct": "Yes" | "No",
  "feedback": string
}
  `.trim();

  const resp = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0
  });

  const text = resp.choices?.[0]?.message?.content || "";
  try {
    return JSON.parse(text.trim());
  } catch {
    return { correct: "No", feedback: text.trim() };
  }
}

module.exports = { checkAnswer };


