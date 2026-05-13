// DOM
const body = document.querySelector("body");
const form = document.querySelector("form");
const list = document.querySelector(".list-of-tasks");
const input = document.querySelector("#task");
const filter = document.querySelector(".filter-container");
const button = document.querySelector(".button-theme-toggle");
const taskTemplate = document.querySelector("#task-template").content;

// State
let tasks = [];
let currentFilter = 'all';

// Storage keys
const saved = localStorage.getItem("tasks");
const themeNow = localStorage.getItem("theme");

if (saved) {
    tasks = JSON.parse(saved);
};

if (themeNow === "dark") {
    body.classList.add("dark-theme");
}

updateUI();

function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function updateUI() {
    renderTasks();
    updateCounter();
    applyFilter();
}

function createTaskElement(template, task, index) {
    const taskTemplateClone = template.cloneNode(true);
    const taskli = taskTemplateClone.querySelector(".task");
    taskli.dataset.index = index;

    const checkboxli = taskTemplateClone.querySelector(".task-checkbox");
    if (task.done) {
        checkboxli.checked = true;
    }

    const textli = taskTemplateClone.querySelector(".task-text");
    textli.textContent = task.text;
    if (task.done) {
        textli.classList.add("completed")
    }
    
    return taskTemplateClone;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let text = input.value.trim();
    if (text.length <= 2) {
        return
    };

    input.value = "";
    input.focus();

    tasks.push({
        text: text,
        done: false
    });
    saveStorage('tasks', tasks);
    updateUI();
});

function renderTasks() {
    list.innerHTML = "";
    if (tasks.length === 0) {
        const li_tasks_empty = document.createElement("li");

        const p_title = document.createElement("p");
        p_title.textContent = "Нет задач ✨";

        const p_subtitle = document.createElement("p");
        p_subtitle.textContent = "Добавьте первую задачу 👇"

        li_tasks_empty.appendChild(p_title);
        li_tasks_empty.appendChild(p_subtitle);
        li_tasks_empty.classList.add("task-empty");
        list.appendChild(li_tasks_empty);
        
        return;
    }
    for (let i = 0; i < tasks.length; i++) {
        list.appendChild(createTaskElement(taskTemplate, tasks[i], i));
    }
};

function deleteTask(li, index) {
    li.classList.add("task-for-delete");
    setTimeout(() => {
        tasks.splice(index, 1);
        saveStorage('tasks', tasks);
        updateUI();
    },
        505);
}

list.addEventListener("dblclick", function (e) {
    const li = e.target.closest(".task");
    if (!li) return;
    if (e.target.closest("button") || e.target.type === "checkbox") return;
    if (list.querySelector(".edit-input")) return;

    startEdit(li);
});

function startEdit(li) {
    let isSaved = false;

    const editInput = document.createElement("input");
    const taskTextElement = li.querySelector("p");
    const oldText = taskTextElement.textContent;

    li.dataset.oldValue = oldText;

    li.classList.add("editing");
    editInput.classList.add("edit-input");
    taskTextElement.replaceWith(editInput);
    editInput.value = oldText;

    editInput.focus();
    editInput.select();

    editInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && isSaved === false) {
            isSaved = true;
            saveEdit(li);
        }
        else if (e.key === "Escape") {
            isSaved = true;
            cancelEdit(li);
        }
    })

    editInput.addEventListener("blur", function (e) {
        if (isSaved) return;
        const nextElement = e.relatedTarget;
        if (nextElement === null) {
            saveEdit(li);
            return;
        }

        const editButton = nextElement.closest('[data-action="edit"]');
        if (!editButton) {
            saveEdit(li);
            return;
        }
        const editLi = editButton.closest('.task');
        if (editLi === li) return;
    })
}

function saveEdit(li) {
    const index = Number(li.dataset.index);
    const input = li.querySelector('.edit-input');
    if (!input) return;

    if (input.value.trim() === "") {
        deleteTask(li, index);
        return;
    }
    const p = document.createElement('p');
    if (tasks[index].done) {
        p.classList.add('completed');
    }

    li.classList.remove("editing");
    input.replaceWith(p);
    p.textContent = input.value;
    tasks[index].text = input.value;
    saveStorage('tasks', tasks);
    delete li.dataset.oldValue;
}

function cancelEdit(li) {
    const input = li.querySelector(".edit-input");
    if (!input) return;
    li.classList.remove("editing");
    const p = document.createElement('p');
    p.textContent = li.dataset.oldValue;
    input.replaceWith(p);
    delete li.dataset.oldValue;
}

list.addEventListener("click", function (e) {
    const li = e.target.closest(".task");
    if (!li) {
        return
    }
    if (li.dataset.index === undefined) {
        return
    }
    const index = Number(li.dataset.index);

    if (e.target.closest('[data-action="delete"]')) {
        deleteTask(li, index);
        return;
    } else if (e.target.closest('[data-action="edit"]')) {
        if (li.classList.contains("editing")) {
            saveEdit(li);
            return;
        } else {
            if (list.querySelector(".editing")) {
                return
            }
            startEdit(li);
            return;
        }
    };

    if (e.target.type === "checkbox") {
        if (e.target.checked) {
            tasks[index].done = true;
        } else {
            tasks[index].done = false;
        }
        saveStorage('tasks', tasks);
        updateUI();
    }
});

function updateCounter() {
    const allLi = document.querySelectorAll(".list-of-tasks li");
    let liTask = 0;
    for (let li of allLi) {
        if (li.dataset.index !== undefined) {
            liTask++;
        }
    }
    const allChecked = list.querySelectorAll("input:checked");
    const output = document.querySelector("output");
    output.innerHTML = `<span>${allChecked.length}</span> из ${liTask} выполнено`
};

filter.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    const liArray = document.querySelectorAll(".list-of-tasks li")
    const allBtn = document.querySelectorAll(".filter-btn");

    if (btn) {
        for (let button of allBtn) {
            button.classList.remove("filter-active");
        }
        btn.classList.add("filter-active");

        let type = btn.dataset.filter;
        currentFilter = type;

        applyFilter();
    };
});

function applyFilter() {
    liArray = document.querySelectorAll(".list-of-tasks li");
    liArray.forEach(element => {
        const inputel = element.querySelector("input");
        if (inputel === null) {
            return
        }
        let doneLi = inputel.checked;
        if (currentFilter === 'active') {
            if (doneLi === false) {
                element.style.display = "flex";
            } else {
                element.style.display = "none";
            }
        } else if (currentFilter === "completed") {
            if (doneLi === true) {
                element.style.display = "flex";
            } else {
                element.style.display = "none";
            }
        } else {
            element.style.display = "flex";
        }
    });
}

/* Переключение темы */
const sunIcon = `<svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
const moonIcon = `<svg width="45px" height="45px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
                </svg>`;
if (themeNow === "dark") {
    button.innerHTML = moonIcon;
} else {
    button.innerHTML = sunIcon;
}

button.addEventListener("click", function (e) {
    body.classList.toggle("dark-theme");

    if (body.classList.contains("dark-theme")) {
        button.innerHTML = moonIcon;
        localStorage.setItem('theme', "dark");
    } else {
        button.innerHTML = sunIcon;
        localStorage.setItem('theme', "light");
    }
});