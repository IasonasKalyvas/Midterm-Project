document.addEventListener("DOMContentLoaded", function () {

    const taskList = [];
    const todayTasks = document.getElementById("todayTasks");
    const completedTasks = document.getElementById("completedTasks");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");
    const root = document.documentElement;
    const storageKey = "theme";
    const filterStatus = document.getElementById("filterStatus");
const sortOption = document.getElementById("sortOption");
if (filterStatus) filterStatus.addEventListener("change", updateTaskDisplay);
if (sortOption) sortOption.addEventListener("change", updateTaskDisplay);

    /* Dark Mode implementation*/

    function applyTheme(theme) {
        if (theme === "dark") {
            root.classList.add("dark");
            darkModeIcon.classList.remove("bi-moon-fill");
            darkModeIcon.classList.add("bi-sun-fill");
        } else {
            root.classList.remove("dark");
            darkModeIcon.classList.remove("bi-sun-fill");
            darkModeIcon.classList.add("bi-moon-fill");
        }
    }

    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) applyTheme(savedTheme);

    darkModeToggle.addEventListener("click", () => {
        const isDark = root.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";
        localStorage.setItem(storageKey, newTheme);
        applyTheme(newTheme);
    });

    /* Updates the Dashboard counter whenever a task is completed or high incompolete */

    function updateDashboardCounters() {

        const tasksToday = taskList.length;

        const overdueTasks = taskList.filter(
            task => task.priority === "high" && task.status === "incomplete"
        ).length;

        const completedTasksCount = taskList.filter(
            task => task.status === "complete"
        ).length;

        localStorage.setItem("tasksToday", tasksToday);
        localStorage.setItem("tasksOverdue", overdueTasks);
        localStorage.setItem("tasksCompleted", completedTasksCount);
    }

    /* Add a task */

    document.getElementById("addTask").addEventListener("click", function () {

        const search = document.getElementById("search").value.trim();
        const dept = document.getElementById("dept").value;
        const status = document.getElementById("status").value;
        const priority = document.getElementById("priority").value;

        if (search && dept && status && priority) {

            const task = {
                name: search,
                dept: dept,
                status: status,
                priority: priority,
                dueDate: new Date().toLocaleString()
            };

            taskList.push(task);

            updateTaskDisplay();
            saveTasksToLocalStorage();
            updateHomePageAlerts();
            updateDashboardCounters();
        }
    });

    /* Display all the tasks added */

   function updateTaskDisplay() {

    todayTasks.innerHTML = '';
    completedTasks.innerHTML = '';

    let filteredTasks = [...taskList];

    /* Filtering */
    if (filterStatus && filterStatus.value !== "all") {
        filteredTasks = filteredTasks.filter(
            task => task.status === filterStatus.value
        );
    }

    /* Sorting*/
    if (sortOption && sortOption.value === "name") {
        filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    /* Displaying */
    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        const deptClass = task.dept === "Storage" ? "dept-storage" : "dept-cleaning";

        const deleteButton =
            `<button class="btn btn-danger" onclick="deleteTask('${task.name}')">🗑️ Delete</button>`;

        const completeButton =
            `<button class="btn btn-success me-2" onclick="completeTask('${task.name}')">✔️ Completed</button>`;

        taskElement.innerHTML = `
            <div class="${deptClass}">
                <span>🔹 ${task.name}</span>
                <span>Dept: ${task.dept} | Status: ${task.status} | Priority: ${task.priority}</span>
            </div>
            ${task.status === "incomplete" ? completeButton : ''} ${deleteButton}
        `;

        if (task.status === "incomplete") {
            todayTasks.appendChild(taskElement);
        } else {
            completedTasks.appendChild(taskElement);
        }
    });
}

    /* Stores to local storage the tasks */

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    function loadTasksFromLocalStorage() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            savedTasks.forEach(task => taskList.push(task));
            updateTaskDisplay();
            updateHomePageAlerts();
            updateDashboardCounters();
        }
    }

    /* Whenever a task is completed it moves and updates counters*/

    window.completeTask = function (name) {

        const taskIndex = taskList.findIndex(task => task.name === name);

        if (taskIndex > -1) {
            taskList[taskIndex].status = "complete";
            updateTaskDisplay();
            saveTasksToLocalStorage();
            updateHomePageAlerts();
            updateDashboardCounters();
        }
    };

    /* Same logic as the completed */

    window.deleteTask = function (name) {

        const updatedTasks = taskList.filter(task => task.name !== name);

        taskList.length = 0;
        taskList.push(...updatedTasks);

        saveTasksToLocalStorage();
        updateTaskDisplay();
        updateHomePageAlerts();
        updateDashboardCounters();
    };

    /* it updates the home page*/

    function updateHomePageAlerts() {

        let criticalAlerts = [];
        let latestActivity = [];

        taskList.forEach(task => {

            if (task.priority === "high" && task.status === "incomplete") {
                criticalAlerts.push(`🔴 ${task.name} - Due: ${task.dueDate}`);
            }

            if (task.status === "complete") {
                latestActivity.push(`✅ ${task.name} completed on ${task.dueDate}`);
            }
        });

        localStorage.setItem("criticalAlerts", JSON.stringify(criticalAlerts));
        localStorage.setItem("latestActivity", JSON.stringify(latestActivity));
    }

    loadTasksFromLocalStorage();
});