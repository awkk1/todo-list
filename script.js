let body = document.querySelector("body");
let form = document.querySelector("form");
let list = document.querySelector(".list-of-tasks");
let input = document.querySelector("#task");
let filter = document.querySelector(".filter");

let tasks = [];

let saved = localStorage.getItem("tasks");
let themeNow = localStorage.getItem("theme");

if (saved) {
    tasks = JSON.parse(saved);
};

if (tasks.length === 0) {
    tasks = [
        {
            text: "Зайти на сайт",
            done: false
        }
    ];

    localStorage.setItem("tasks", JSON.stringify(tasks));
};

if (themeNow === "dark") {
    body.classList.add("dark-theme");
}

renderTasks();
updateCounter();

form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    let text = input.value.trim();
    let textLength = text.length;
    if (textLength <= 2) {
        return
    };

    input.value = "";

    tasks.push({
        text: text,
        done: false
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    updateCounter();
});

function renderTasks() {
    list.innerHTML = "";
    for (let i =0; i < tasks.length; i++) {
        let li = document.createElement("li");
        li.dataset.index = i;
        list.appendChild(li);
        
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
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

        let buttonForDelete = document.createElement("button");
        buttonForDelete.classList.add("delete-task-button");

        const trashIcon = `
        <svg class="delete-task-icon" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 14L11 16L15 12M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
        buttonForDelete.innerHTML = trashIcon;
        li.appendChild(buttonForDelete);
    }
};

list.addEventListener("click", function(e) {
    let li = e.target.closest("li");
    let index = li.dataset.index;
    if (e.target.closest("button")) {
        tasks.splice(index,1)
    };

    if (e.target.type === "checkbox" ) {
        if (e.target.checked) {
            tasks[index].done = true;
        } else {
            tasks[index].done = false;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks))
    renderTasks();
    updateCounter();
});

function updateCounter() {
    let allLi = document.querySelectorAll(".list-of-tasks li");
    let allChecked = list.querySelectorAll("input:checked");
    let output = document.querySelector("output");
    output.innerHTML = `<span>${allChecked.length}</span> из ${allLi.length} выполнено`
};

filter.addEventListener("click", function(e) {
    let btn = e.target.closest("button");
    let liArray = document.querySelectorAll(".list-of-tasks li")
    let allBtn = document.querySelectorAll(".filter button");
    
    if (btn) {
        for (let button of allBtn) {
            button.classList.remove("active-filter-button");
        }
        btn.classList.add("active-filter-button");

        let type = btn.dataset.filter;

        liArray.forEach(element => {
            let doneLi = element.querySelector("input").checked;
            if (type === 'active') {
                if (doneLi === false) { 
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
            } else if (type === "completed") {
                if (doneLi === true) { 
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
            } else {
                element.style.display = "flex";
            }
        });
    }; 
});

/* Переключение темы */
let button = document.querySelector(".button-theme-toggle")
button.addEventListener("click", function(e) {
    body.classList.toggle("dark-theme");

    if (body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", ("dark"));
    } else {
        localStorage.setItem("theme", ("light"));
    }
});