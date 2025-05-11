// index.js

// 1. Загрузка .env и подключение необходимых модулей
require('dotenv').config();

const express        = require('express');
const path           = require('path');
const mongoose       = require('mongoose');
const bcrypt         = require('bcrypt');
const session        = require('express-session');
const nodemailer     = require('nodemailer');

// Модель пользователя
const User = require('./models/User');

// Роутеры
const adminUsersRouter        = require('./routes/adminUsers');
const adminAssignmentsRouter  = require('./routes/adminAssignments');
const adminDashboardRouter    = require('./routes/adminDashboard');
const studentAssignmentsRouter= require('./routes/studentAssignments');

// Функция проверки ответов через OpenAI
const { checkAnswer } = require('./aiChecker');

// 2. Создаём приложение
const app  = express();
const port = process.env.PORT || 3000;

// 3. Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/edu-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('MongoDB connection error:', err));

// 4. Настройка middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// 5. Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Основные маршруты
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Введите имя пользователя, email и пароль.');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Пользователь с таким email уже существует.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.send('Пользователь зарегистрирован!');
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).send('Ошибка регистрации.');
  }
});

// 7. Подключение маршрутов админ-панели и студентских заданий
app.use('/admin', adminUsersRouter);
app.use('/admin', adminDashboardRouter);
app.use('/admin', adminAssignmentsRouter);
app.use('/',    studentAssignmentsRouter);

// 8. API для проверки ответов через OpenAI
// Ожидает JSON в body: { question, correctAnswer, studentAnswer }
app.post('/api/check-answer', async (req, res) => {
  try {
    const { question, correctAnswer, studentAnswer } = req.body;
    const result = await checkAnswer(question, correctAnswer, studentAnswer);
    res.json(result);
  } catch (err) {
    console.error('Ошибка в /api/check-answer:', err);
    res.status(500).json({
      correct: "No",
      feedback: "Серверная ошибка при проверке."
    });
  }
});

// 9. Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
