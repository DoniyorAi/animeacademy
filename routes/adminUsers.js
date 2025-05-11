// routes/adminUsers.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    // Находим всех пользователей и преобразуем результаты в обычные объекты для рендеринга
    const users = await User.find({}).lean();
    // Если хотите сначала проверить, что данные приходят, раскомментируйте следующую строку:
    // return res.json(users);
    res.render('adminUsers', { users });
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    res.status(500).send("Ошибка сервера при получении списка пользователей");
  }
});

module.exports = router;



