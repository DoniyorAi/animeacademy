submitQuizButton.addEventListener('click', function() {
    console.log("Кнопка нажата");
    const answers = [];
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach((q, index) => {
      const selected = q.querySelector('input[type="radio"]:checked');
      if (selected) {
        answers.push(parseInt(selected.value));
      } else {
        answers.push(-1);
      }
    });
    console.log("Отправляем ответы:", answers);
    fetch('/api/check-quiz/html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
    .then(res => res.json())
    .then(result => {
      console.log("Результат от сервера:", result);
      const resultDiv = document.getElementById('quiz-result');
      resultDiv.textContent = `Вы правильно ответили на ${result.correctCount} из ${result.total} вопросов!`;
      anime({
        targets: '#quiz-result',
        scale: [0.5, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
      });
    })
    .catch(err => console.error("Ошибка проверки quiz:", err));
  });
  