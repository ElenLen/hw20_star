"use strict";

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("data.json")
    .then((response) => {
      const tasks = response.data;
      filterTasks(tasks);
      drawChart(tasks);
    })
    .catch((error) => {
      console.error("Ошибка загрузки данных:", error);
    });
});

// Функция для отрисовки графика
function drawChart(tasks) {
  const statuses = [];
  tasks.forEach((task) => {
    statuses[task.status] = (statuses[task.status] || 0) + 1;
  });

  const ctx = document.getElementById("tasksChart").getContext("2d");

  // Если график уже существует, удаляем его
  if (window.myChart.ctx) {
    window.myChart.destroy();
  }

  // Создаем новый график
  window.myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(statuses),
      datasets: [
        {
          label: "Количество задач по статусу",
          data: Object.values(statuses),
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Статистика задач",
        },
      },
    },
  });
}

// фильтр задач
function filterTasks(tasks) {
  // при первоначальном старте
  const filtrStart = document.getElementById("statusFilter").value;
  if (filtrStart === "all") {
    displayTasks(tasks);
  }
  // выборе в фильтре
  document
    .getElementById("statusFilter")
    .addEventListener("change", (event) => {
      const selectedStatus = event.target.value;
      const filteredTasks =
        selectedStatus === "all"
          ? tasks
          : tasks.filter((task) => task.status === selectedStatus);
      displayTasks(filteredTasks);
    });
}

// отображение списка задач
function displayTasks(tasks) {
  const tasksList = document.getElementById("tasksList");
  tasksList.innerHTML = ""; // Очищаем список перед отображением

  // добавление задач
  document.getElementById("addTaskButton").addEventListener("click", () => {
    const title = document.getElementById("newTaskTitle").value;
    const status = document.getElementById("newTaskStatus").value;

    if (title && status) {
      tasks.push({ title, status });
      displayTasks(tasks);
      drawChart(tasks);
      document.getElementById("newTaskTitle").value = "";
      document.getElementById("newTaskStatus").value = "";
    }
  });

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = task.title + " - " + task.status;

    // Кнопка редактирования
    const editButton = document.createElement("button");
    editButton.textContent = "Редактировать";
    editButton.className = "btn btn-sm btn-primary ml-2";
    editButton.onclick = () => editTask(index);

    function editTask(index) {
      const task = tasks[index];
      const newTitle = prompt("Введите новое название задачи:", task.title);
      const newStatus = prompt("Введите новый статус задачи:", task.status);

      if (newTitle && newStatus) {
        tasks[index] = { title: newTitle, status: newStatus }; // Обновляем задачу
        displayTasks(tasks); // Обновляем отображение
        drawChart(tasks); // Перерисовываем график
      }
    }

    // Кнопка удаления
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.className = "btn btn-sm btn-danger ml-2";
    deleteButton.onclick = () => {
      tasks.splice(index, 1); // Удаляем задачу
      displayTasks(tasks);
      drawChart(tasks);
    };

    // блок для кнопок
    const divButton = document.createElement("div");

    divButton.appendChild(editButton);
    divButton.appendChild(deleteButton);
    li.appendChild(divButton);
    tasksList.appendChild(li);
  });
}

// график со статистикой
const ctx = document.getElementById("myChart");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    datasets: [
      {
        label: "Статистика работоспособности",
        data: [12, 19, 13, 15, 10, 8, 5],
        borderWidth: 1,
      },
    ],
  },
  options: {
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
