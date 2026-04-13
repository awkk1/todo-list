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

        let imgButtonForDelete = document.createElement("img");
        imgButtonForDelete.src = "img/trashcan.svg";
        imgButtonForDelete.classList.add("delete-task-icon");

        buttonForDelete.appendChild(imgButtonForDelete);
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