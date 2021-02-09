const newTaskForm = document.querySelector(".taskList__newTask");
const taskListContainer = document.querySelector(".taskList__container")
const taskListFooter = document.querySelector(".taskList__footer");
const filterForm = document.querySelector(".taskList__filter");
const filterInput = filterForm.filter;
const footerCounter = document.querySelector(".taskList__count");
const checkAllBtn = document.querySelector(".taskList__checkAll");
const clearCompletedBtn = document.querySelector(".taskList__clearCompleted");
let currentTaskList = [];
let itemCounter = 0;
let currentFilter = "all";
let generatedId = 0;

countTasks();

// Agregar tarea a lista
newTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newTask = {
        id: generatedId,
        name: newTaskForm.taskName.value,
        status: "active"
    }
    currentTaskList.push(newTask);
    newTaskForm.taskName.value = "";
    generatedId++;
    renderTaskList(currentTaskList, currentFilter);
    countTasks();
})

// Completar todas las tareas
checkAllBtn.addEventListener("click", function () {
    let activeTask = checkTaskStatus(currentTaskList);

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
    countTasks();
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
    let listCopy = list.slice();
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

        <p class="task__description">${elem.name}</p>

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
    let activeTask = checkTaskStatus(list);
    if (activeTask < 1) {
        checkAllBtn.classList.add("taskList__checkAll--active")
    } else {
        checkAllBtn.classList.remove("taskList__checkAll--active")
    }
}

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

    if (itemCounter < 1) {
        taskListFooter.classList.add("hidden")
    } else {
        taskListFooter.classList.remove("hidden")
    }
}


function checkTaskStatus(list) {
    let activeTask = 0;

    list.forEach(function (elem) {
        if (elem.status != "completed") {
            activeTask++;
        }
    })
    return activeTask;
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
    countTasks();
}

// Borrar tarea
function deleteTask(elem) {
    currentTaskList.splice(currentTaskList.indexOf(elem), 1);
    renderTaskList(currentTaskList, currentFilter);
    countTasks();
}

// Aplicar filtros
filterForm.addEventListener("input", function () {
    let filterValue = filterInput.value;
    currentFilter = filterValue;
    renderTaskList(currentTaskList, currentFilter);
})
