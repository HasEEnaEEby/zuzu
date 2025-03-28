class Task {
    constructor(description, id = Date.now(), completed = false) {
      this.description = description;
      this.completed = completed;
      this.id = id;
    }
  
    toggle() {
      this.completed = !this.completed;
    }
  }
  
  class TaskManager {
    constructor() {
      this.tasks = this.loadFromLocalStorage();
      this.taskListRight = document.getElementById("taskListRight");
      this.taskListLeft = document.getElementById("taskListLeft");
      this.taskInput = document.getElementById("taskInput");
      this.render();
    }
  
    addTask() {
      const value = this.taskInput.value.trim();
      if (value === "") return;
  
      const task = new Task(value);
      this.tasks.push(task);
      this.taskInput.value = "";
      this.saveToLocalStorage();
      this.render();
    }
  
    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveToLocalStorage();
      this.render();
    }
  
    clearAll() {
      this.tasks = [];
      this.saveToLocalStorage();
      this.render();
    }
  
    clearCompleted() {
      this.tasks = this.tasks.filter(task => !task.completed);
      this.saveToLocalStorage();
      this.render();
    }
  
    saveToLocalStorage() {
      localStorage.setItem("todo-tasks", JSON.stringify(this.tasks));
    }
  
    loadFromLocalStorage() {
      const saved = localStorage.getItem("todo-tasks");
      if (!saved) return [];
      const rawTasks = JSON.parse(saved);
      return rawTasks.map(t => new Task(t.description, t.id, t.completed));
    }
  
    render() {
      this.taskListRight.innerHTML = "";
      this.taskListLeft.innerHTML = `<div class="emoji-banner">🎉 You're doing great! 🎉</div>`;
  
      this.tasks.forEach(task => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const span = document.createElement("span");
        span.textContent = task.description;
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
  
        if (task.completed) {
          span.classList.add("completed-text");
          li.appendChild(span);
          this.taskListLeft.appendChild(li);
        } else {
          checkbox.addEventListener("change", () => {
            li.classList.add("fade-out");
            span.style.textDecoration = "line-through";
  
            setTimeout(() => {
              task.toggle();
              this.saveToLocalStorage();
              this.render();
            }, 1000);
          });
  
          const trash = document.createElement("span");
          trash.innerHTML = "🗑️";
          trash.style.cursor = "pointer";
          trash.addEventListener("click", () => this.deleteTask(task.id));
  
          label.appendChild(checkbox);
          label.appendChild(span);
          li.appendChild(label);
          li.appendChild(trash);
          this.taskListRight.appendChild(li);
        }
      });
    }
  }
  
  const taskManager = new TaskManager();
  