// routes/adminAuth.js
const express = require('express');
const router = express.Router();

// Страница входа администратора
router.get('/login', (req, res) => {
  res.render('adminLogin'); // создайте шаблон adminLogin.ejs в папке views
});

module.exports = router;

