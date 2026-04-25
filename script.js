let body = document.querySelector("body");
let form = document.querySelector("form");
let list = document.querySelector(".list-of-tasks");
let input = document.querySelector("#task");
let filter = document.querySelector(".filter-container");
let currentFilter = 'all';

let tasks = [];

let saved = localStorage.getItem("tasks");
let themeNow = localStorage.getItem("theme");

if (saved) {
    tasks = JSON.parse(saved);
};

if (themeNow === "dark") {
    body.classList.add("dark-theme");
}

renderTasks();
updateCounter();
applyFilter();

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
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    updateCounter();
    applyFilter();
});

function renderTasks() {
    list.innerHTML = "";
    if (tasks.length === 0) {
        let li_tasks_empty = document.createElement("li");

        let p_title = document.createElement("p");
        p_title.textContent = "Нет задач ✨";

        let p_subtitle = document.createElement("p");
        p_subtitle.textContent =  "Добавьте первую задачу 👇"
        
        li_tasks_empty.appendChild(p_title);
        li_tasks_empty.appendChild(p_subtitle);
        li_tasks_empty.classList.add("task-empty");
        list.appendChild(li_tasks_empty);
    }
    else
        for (let i = 0; i < tasks.length; i++) {
            let li = document.createElement("li");
            li.dataset.index = i;
            li.classList.add("task");
            list.appendChild(li);

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "task";
            if (tasks[i].done) {
                checkbox.checked = true
            } else {
                checkbox.checked = false
            };
            li.appendChild(checkbox);

            let p = document.createElement("p");
            p.textContent = tasks[i].text;
            if (tasks[i].done) {
                p.classList.add("completed")
            }
            li.appendChild(p);

            let buttonForEdit = document.createElement("button");
            buttonForEdit.classList.add("button-for-edit");
            buttonForEdit.dataset.action = "edit";
            const editIcon = `
            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
            buttonForEdit.innerHTML = editIcon;
            li.appendChild(buttonForEdit);

            let buttonForDelete = document.createElement("button");
            buttonForDelete.classList.add("delete-task-button");
            buttonForDelete.dataset.action = "delete";

            const trashIcon = `
        <svg class="delete-task-icon" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 14L11 16L15 12M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
            buttonForDelete.innerHTML = trashIcon;
            li.appendChild(buttonForDelete);
        }
};

list.addEventListener("dblclick", function (e) {
    let li = e.target.closest(".task");

    if (!li) return;
    if (e.target.closest("button") || e.target.type === "checkbox") return;
    if (list.querySelector(".edit-input")) return;

    startEdit(li);
});

function startEdit(li) {
    const li_index = Number(li.dataset.index);
    let inputNew= document.createElement("input");
    let p = li.querySelector("p");
    const p_content = p.textContent;
    inputNew.classList.add("edit-input");
    inputNew.name = "editing";
    p.replaceWith(inputNew);
    inputNew.value = p_content;
    inputNew.focus();
    inputNew.select();

    let isSaved = false;

    function saveEdit() {
        if (inputNew.value.trim() === "") {
            li.classList.add("task-for-delete");
            setTimeout(() => {
            tasks.splice(li_index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            updateCounter();
            applyFilter();
        },
            505);
            return;
        } else {
            isSaved = true;
            inputNew.replaceWith(p);
            p.textContent = inputNew.value;
            tasks[li_index].text = inputNew.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

    function cancelEdit() {
        isSaved = true;
        inputNew.replaceWith(p);
        p.textContent = p_content;
    }

    inputNew.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && isSaved === false) {
            saveEdit();
        } else if (e.key === "Escape") {
            cancelEdit();
        }
    })

    inputNew.addEventListener("blur", function (e) {
        if (isSaved) return;
        saveEdit();
    })
}

list.addEventListener("click", function (e) {
    let li = e.target.closest(".task");
    if (!li) {
        return
    }
    if (li.dataset.index === undefined) {
        return
    }
    let index = Number(li.dataset.index);

    if (e.target.closest('[data-action="delete"]')) {
        li.classList.add("task-for-delete");
        setTimeout(() => {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            updateCounter();
            applyFilter();
        },
            505);
        return;
    } else if (e.target.closest('[data-action="edit"]')) {
        startEdit(li);
    };

    if (e.target.type === "checkbox") {
        if (e.target.checked) {
            tasks[index].done = true;
        } else {
            tasks[index].done = false;
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        updateCounter();
        applyFilter();
    }
});

function updateCounter() {
    let allLi = document.querySelectorAll(".list-of-tasks li");
    let liTask = 0;
    for (let li of allLi) {
        if (li.dataset.index !== undefined) {
            liTask++;
        }
    }
    let allChecked = list.querySelectorAll("input:checked");
    let output = document.querySelector("output");
    output.innerHTML = `<span>${allChecked.length}</span> из ${liTask} выполнено`
};

filter.addEventListener("click", function (e) {
    let btn = e.target.closest("button");
    let liArray = document.querySelectorAll(".list-of-tasks li")
    let allBtn = document.querySelectorAll(".filter-btn");

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
        let inputel = element.querySelector("input");
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
let button = document.querySelector(".button-theme-toggle")
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
        localStorage.setItem("theme", ("dark"));
    } else {
        button.innerHTML = sunIcon;
        localStorage.setItem("theme", ("light"));
    }
});