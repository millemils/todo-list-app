// Menunggu hingga dokumen HTML selesai dimuat sebelum menjalankan kode JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");

  let tasksData = [];

  // Ambil data dari file JSON saat halaman dibuka
  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      tasksData = data;
      renderTasks(tasksData);
    });

  // Menambahkan list pada tombol "Add" untuk menambahkan tugas
  addBtn.addEventListener("click", function () {
    const taskText = todoInput.value;
    if (taskText.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };
      tasksData.push(newTask);
      saveDataToJson(tasksData);
      renderTasks(tasksData);
      todoInput.value = "";
    }
  });

  // Menambahkan atau menampilkan list yang sudah diinput pada daftar tugas untuk menghapus tugas atau menandai sebagai selesai
  todoList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-icon")) {
      // Menghapus tugas dari daftar jika ikon hapus diklik
      const taskElement = event.target.parentNode;
      const taskId = parseInt(taskElement.getAttribute("data-task-id"));
      tasksData = tasksData.filter((task) => task.id !== taskId);
      saveDataToJson(tasksData);
      renderTasks(tasksData);
    } else if (event.target.classList.contains("checkbox")) {
      // Menandai tugas sebagai selesai atau tidak selesai ketika kotak centang diklik
      const taskElement = event.target.parentNode;
      const taskId = parseInt(taskElement.getAttribute("data-task-id"));
      const task = tasksData.find((task) => task.id === taskId);
      task.completed = event.target.checked;
      saveDataToJson(tasksData);
      const taskLabel = taskElement.querySelector("label");
      if (task.completed) {
        taskLabel.style.textDecoration = "line-through";
      } else {
        taskLabel.style.textDecoration = "none";
      }
    }
  });

  // menampilkan elemen tugas baru yang telah di ceklis sehingga listnya tercoret
  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("data-task-id", task.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = task.completed;

    const taskLabel = document.createElement("label");
    taskLabel.textContent = task.text;
    if (task.completed) {
      taskLabel.style.textDecoration = "line-through";
    }

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "delete-icon";
    deleteIcon.innerHTML = "&times;";

    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskLabel);
    taskElement.appendChild(deleteIcon);

    return taskElement;
  }

  // Render ulang daftar tugas
  function renderTasks(tasks) {
    todoList.innerHTML = "";
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      todoList.appendChild(taskElement);
    });
  }

  // Menyimpan data inputan ke file JSON
  function saveDataToJson(data) {
    fetch("save.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  // Memperbarui status terakhir tugas berdasarkan status selesai
  function updateTaskStyle(taskElement, completed) {
    const taskLabel = taskElement.querySelector("label");
    if (completed) {
      taskLabel.style.textDecoration = "line-through";
    } else {
      taskLabel.style.textDecoration = "none";
    }
  }
});
