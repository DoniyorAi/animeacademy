// routes/studentAssignments.js
/*const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { checkAnswer } = require('../aiChecker');

// Отображение списка заданий для студентов
router.get('/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find({}).lean();
    res.render('studentAssignments', { assignments });
  } catch (error) {
    console.error("Ошибка при получении заданий:", error);
    res.status(500).send("Ошибка сервера при получении заданий");
  }
});

// Отображение страницы конкретного задания
router.get('/assignments/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) return res.status(404).send("Задание не найдено");
    res.render('assignmentDetail', { assignment });
  } catch (error) {
    console.error("Ошибка при получении задания:", error);
    res.status(500).send("Ошибка сервера при получении задания");
  }
});

// Обработка ответа студента с проверкой ИИ
router.post('/assignments/:id/submit', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) return res.status(404).send("Задание не найдено");
    
    const { studentAnswer } = req.body;
    // Вызываем функцию проверки ИИ:
    const grade = await checkAnswer(assignment.question, assignment.correctAnswer, studentAnswer);
    
    // Здесь можно сохранить результат проверки в базе данных, привязав к пользователю и заданию
    
    res.json({ grade, message: "Ваш ответ проверен ИИ" });
  } catch (error) {
    console.error("Ошибка при проверке задания:", error);
    res.status(500).send("Ошибка сервера при проверке задания");
  }
});

module.exports = router;

*/
// routes/studentAssignments.js
const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { checkAnswer } = require('../aiChecker'); // ваша функция проверки через ИИ

// Маршрут для проверки ответа студента
router.post('/check-assignment', async (req, res) => {
  try {
    // 1. Извлекаем данные из формы
    const { lessonId, studentAnswer } = req.body;

    // 2. Находим задание по lessonId
    const assignment = await Assignment.findOne({ lessonId });
    if (!assignment) {
      return res.status(404).send('Задание не найдено');
    }

    // 3. Вызываем ИИ-проверку
    const grade = await checkAnswer(
      assignment.question,
      assignment.correctAnswer,
      studentAnswer
    );

    // 4. Начисляем баллы пользователю
    // Предположим, что у вас есть req.session.userId
    if (!req.session.userId) {
      return res.status(401).send('Необходима авторизация');
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }

    // Например, задание даёт максимум assignment.maxPoints баллов,
    // а grade — это процент правильности от 0 до 100
    const pointsEarned = Math.round((grade / 100) * assignment.maxPoints);

    user.points += pointsEarned;
    await user.save();

    // 5. Возвращаем результат проверки
    res.send(`Вы набрали ${pointsEarned} баллов из ${assignment.maxPoints} возможных.`);
  } catch (error) {
    console.error('Ошибка при проверке задания:', error);
    res.status(500).send('Ошибка сервера при проверке задания');
  }
});

module.exports = router;
