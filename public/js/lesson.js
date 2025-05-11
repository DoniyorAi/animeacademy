document.addEventListener("DOMContentLoaded", function () {
  const tabLinks = document.querySelectorAll(".tab-link");
  const sections = document.querySelectorAll(".tab-content");
  const quizContainer = document.getElementById("quiz-container");

  tabLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Убираем стандартное поведение

      const target = this.getAttribute("data-target");
      sections.forEach(section => section.style.display = "none"); // Скрываем все секции
      document.getElementById(target).style.display = "block"; // Показываем нужную секцию

      if (target === "assignments") {
        loadAssignments(); // Загружаем задания
      }
    });
  });

  // Полностью скрываем поле ввода
  const answerField = document.querySelector("#answer-box");
  if (answerField) {
    answerField.style.display = "none";
  }
});

function loadAssignments() {
  fetch("/localstorage/assignments") // Подставь правильный путь к данным
    .then(response => response.json())
    .then(assignments => {
      const quizContainer = document.getElementById("quiz-container");
      quizContainer.innerHTML = ""; // Очищаем перед добавлением новых заданий

      assignments.forEach(assignment => {
        const questionBlock = document.createElement("div");
        questionBlock.classList.add("assignment-item");
        questionBlock.innerHTML = `
          <h3>${assignment.title}</h3>
          <p>${assignment.description}</p>
          <textarea id="answer-${assignment.id}" rows="3" cols="50" placeholder="Введите ваш ответ"></textarea>
          <button onclick="submitAnswer(${assignment.id})">Отправить</button>
        `;
        quizContainer.appendChild(questionBlock);
      });
    })
    .catch(error => console.error("Ошибка при загрузке заданий:", error));
}

function submitAnswer(assignmentId) {
  const answerField = document.getElementById(`answer-${assignmentId}`);
  const studentAnswer = answerField.value;

  fetch("/api/check-assignment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assignmentId: assignmentId,
      studentAnswer: studentAnswer,
    }),
  })
    .then(response => response.json())
    .then(data => {
      alert(`Результат: ${data.result}`);
    })
    .catch(error => console.error("Ошибка при отправке ответа:", error));
}
