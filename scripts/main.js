const newTaskForm = document.querySelector(".taskList__newTask");
const taskListContainer = document.querySelector(".taskList__container")
const taskListFooter = document.querySelector(".taskList__footer");
const filterForm = document.querySelector(".taskList__filter");
const filterInput = filterForm.filter;
const footerCounter = taskListFooter.querySelector(".taskList__count");
const clearCompletedBtn = document.querySelector(".taskList__clearCompleted");
let currentTaskList = [];
let itemCounter = 0;
let currentFilter = "all";

// Agregar tarea a lista
newTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newTask = {
        name: newTaskForm.taskName.value,
        status: "active"
    }
    currentTaskList.push(newTask);
    renderTaskList(currentTaskList, currentFilter);
    countTasks();
    //console.log(itemCounter)
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

    let listCopy = list.slice();

    listCopy = list.filter(function (elem) {
        if (elem.status === filter) {
            return true;
        } else if (filter == "all") {
            return true;
        }
    })
    //currentFilter = filter.value;

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
        if (list[i].status == "completed") {
            newTask.classList.add("task--completed")
        } else {
            newTask.classList.remove("task--completed")
        }

        // Agregar al contenedor
        taskListContainer.appendChild(newTask);

        // Boton para finalizar tarea
        const checkBtn = newTask.querySelector(".task__status");
        checkBtn.addEventListener("click", function () {
            completeTask(newTask, i);
        })

        // Boton para borrar tarea
        const deleteBtn = newTask.querySelector(".task__delete");
        deleteBtn.addEventListener("click", function () {
            deleteTask(i);
        })
    })
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
}

// Completar tarea
function completeTask(task, i) {
    if (currentTaskList[i].status != "completed") {
        currentTaskList[i].status = "completed";
        renderTaskList(currentTaskList, currentFilter);
        //task.classList.add("task--completed")
    } else {
        currentTaskList[i].status = "active";
        renderTaskList(currentTaskList, currentFilter);
        //task.classList.remove("task--completed")
    }

    countTasks();
    //console.log(itemCounter);
}

// Borrar tarea
function deleteTask(i) {
    currentTaskList.splice(i, 1);
    renderTaskList(currentTaskList, currentFilter);
    countTasks();
    //console.log(itemCounter)
}

// Filtrar tareas
filterForm.addEventListener("input", function () {
    //let listCopy = currentTaskList.slice();
    let filterValue = filterInput.value;

    /*listCopy = listCopy.filter(function (elem) {
        if (elem.status === filterValue) {
            return true;
        } else if(filterValue == "all") {
            return true;
        }
    })*/

    currentFilter = filterValue;
    renderTaskList(currentTaskList, currentFilter);
})
