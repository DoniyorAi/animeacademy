// routes/adminDashboard.js
const express = require('express');
const router = express.Router();

// Обработчик для главной страницы админ-панели
router.get('/', (req, res) => {
  res.render('adminDashboard'); // создайте файл views/adminDashboard.ejs
});

module.exports = router;
