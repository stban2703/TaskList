const newTaskForm = document.querySelector(".taskList__newTask");
const taskListContainer = document.querySelector(".taskList__container")
const taskListFooter = document.querySelector(".taskList__footer");
const filterForm = document.querySelector(".taskList__filter");
const filterList = document.querySelectorAll(".taskList__filter label");
const filterInput = filterForm.filter;
const footerCounter = document.querySelector(".taskList__count");
const checkAllBtn = document.querySelector(".taskList__checkAll");
const clearCompletedBtn = document.querySelector(".taskList__clearCompleted");
let currentTaskList = [];
let itemCounter = 0;
let selectedFilter = 0;
let currentFilter = "all";
let generatedId = 0;
let savedTaskList = localStorage.getItem("list");
let taskListHistory = [];

if(savedTaskList) {
    currentTaskList = JSON.parse(savedTaskList);
}

renderTaskList(currentTaskList, currentFilter);

// Mostrar filtro actual
filterList.forEach(function (elem, i) {
    elem.addEventListener("click", function () {
        selectedFilter = i;
    });
})

//countTasks();
checkTasKListLenght();

// Agregar tarea a lista
newTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let inputText = newTaskForm.taskName.value;
    if (inputText != "") {
        let newTask = {
            id: generatedId,
            name: inputText,
            status: "active"
        }
        currentTaskList.push(newTask);
        newTaskForm.taskName.value = "";
        generatedId++;
        renderTaskList(currentTaskList, currentFilter);
    }
})

// Completar todas las tareas
checkAllBtn.addEventListener("click", function () {
    let activeTask = checkActiveTasks(currentTaskList);

    if (activeTask > 0) {
        currentTaskList.forEach(function (elem) {
            elem.status = "completed"
        });
    } else {
        currentTaskList.forEach(function (elem) {
            elem.status = "active"
        });
    }

    renderTaskList(currentTaskList, currentFilter);
})

// Limpiar todas las tareas completadas
clearCompletedBtn.addEventListener("click", function () {
    currentTaskList = currentTaskList.filter(function (e) {
        return e.status != "completed";
    });
    renderTaskList(currentTaskList, currentFilter);
})

// Mostrar lista
function renderTaskList(list, filter) {
    taskListContainer.innerHTML = ``;

    // Copiar lista y filtrarla
    let listCopy = [...list];
    listCopy = list.filter(function (elem) {
        if (elem.status === filter) {
            return true;
        } else if (filter == "all") {
            return true;
        }
    })

    // Crear objeto HTML
    listCopy.forEach(function (elem, i) {
        const newTask = document.createElement('div');
        newTask.classList.add("task");
        newTask.innerHTML = `
        <div class="task__status">
            <img src="./img/verified.svg" alt="">
        </div>

        <p class="task__description" contenteditable="false">${elem.name}</p>

        <div class="task__delete">
            <img src="./img/borrar.svg" alt="">
        </div>
        `

        // Verificar el estado de la tarea
        if (listCopy[i].status == "completed") {
            newTask.classList.add("task--completed")
        } else {
            newTask.classList.remove("task--completed")
        }

        // Agregar al contenedor
        taskListContainer.appendChild(newTask);

        // Editar texto
        const editableText = newTask.querySelector(".task__description");
        editableText.addEventListener("dblclick", function () {
            editableText.setAttribute("contenteditable", true);
        })

        document.addEventListener("click", function (event) {
            let isClickInside = editableText.contains(event.target);

            if (!isClickInside) {
                editableText.setAttribute("contenteditable", false);
                elem.name = editableText.innerText;
            }
        })

        // Boton para finalizar tarea
        const checkBtn = newTask.querySelector(".task__status");
        checkBtn.addEventListener("click", function () {
            completeTask(elem);
        })

        // Boton para borrar tarea
        const deleteBtn = newTask.querySelector(".task__delete");
        deleteBtn.addEventListener("click", function () {
            deleteTask(elem);
        })
    })

    // Verificar estado para el boton de completar todo
    let activeTask = checkActiveTasks(list);
    let completedTask = list.length - checkActiveTasks(list);

    if (activeTask < 1 && currentTaskList.length > 0) {
        checkAllBtn.classList.add("taskList__checkAll--active")
    } else if (activeTask > 0) {
        checkAllBtn.classList.remove("taskList__checkAll--active")
    }

    if (completedTask > 0) {
        clearCompletedBtn.classList.remove("hidden");
    } else {
        clearCompletedBtn.classList.add("hidden");
    }

    // Mostrar filtro activo
    filterList.forEach(function (elem, i) {
        if (i == selectedFilter) {
            elem.classList.add("selected");
        } else {
            elem.classList.remove("selected");
        }
    })

    // Verificar si existen tareas
    checkTasKListLenght();

    // Contar tareas activas
    countTasks();

    localStorage.setItem("list", JSON.stringify(list))
    taskListHistory.push({
        list: JSON.parse(JSON.stringify(list)),
        filter: filter
    })
}

document.addEventListener("keyup", function(event) {
    console.log(event)
    if(event.key == 'z' && event.ctrlKey) {
        taskListHistory.pop();
        let current = taskListHistory.pop();

        currentTaskList = current.list;
        currentFilter = current.filter;

        renderTaskList(currentTaskList, currentFilter);
    }
})

// Contar tareas activas
function countTasks() {
    itemCounter = 0;

    currentTaskList.forEach(function (elem, i) {
        if (elem.status == "active") {
            itemCounter++;
        }
    })

    // Mostrar contador
    footerCounter.innerText = itemCounter;
}

// Verificar tareas activas
function checkActiveTasks(list) {
    let activeTask = 0;

    list.forEach(function (elem) {
        if (elem.status != "completed") {
            activeTask++;
        }
    })
    return activeTask;
}

// Verificat si hay tareas en la lita total
function checkTasKListLenght() {
    if (currentTaskList.length < 1) {
        checkAllBtn.classList.add("hidden");
        taskListFooter.classList.add("removed");
    } else {
        checkAllBtn.classList.remove("hidden");
        taskListFooter.classList.remove("removed");
    }
}

// Completar tarea
function completeTask(elem) {
    if (currentTaskList[currentTaskList.indexOf(elem)].status != "completed") {
        currentTaskList[currentTaskList.indexOf(elem)].status = "completed";
        renderTaskList(currentTaskList, currentFilter);

    } else if (currentTaskList[currentTaskList.indexOf(elem)].status == "completed") {
        currentTaskList[currentTaskList.indexOf(elem)].status = "active";
        renderTaskList(currentTaskList, currentFilter);
    }
}

// Borrar tarea
function deleteTask(elem) {
    currentTaskList.splice(currentTaskList.indexOf(elem), 1);
    renderTaskList(currentTaskList, currentFilter);
}

// Aplicar filtros
filterForm.addEventListener("input", function () {
    let filterValue = filterInput.value;
    currentFilter = filterValue;
    renderTaskList(currentTaskList, currentFilter);
})
