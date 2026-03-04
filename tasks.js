document.addEventListener("DOMContentLoaded", function () {

    const taskList = [];

    const todayTasks = document.getElementById("todayTasks");
    const completedTasksContainer = document.getElementById("completedTasks");

    const filterStatus = document.getElementById("filterStatus");
    const sortOption = document.getElementById("sortOption");
    const addBtn = document.getElementById("addTask");

    /* Add a task */

    if (addBtn) {
        addBtn.addEventListener("click", function () {

            const search = document.getElementById("search").value.trim();
            const dept = document.getElementById("dept").value;
            const status = document.getElementById("status").value;
            const priority = document.getElementById("priority").value;

            if (!search || !dept || !status || !priority) {
                alert("Please fill all fields.");
                return;
            }

            const task = {
                name: search,
                dept: dept,
                status: status,
                priority: priority,
                dueDate: new Date().toISOString()
            };

            taskList.push(task);

            saveTasksToLocalStorage();
            updateTaskDisplay();
            updateHomePageAlerts();
            updateDashboardCounters();

            document.getElementById("search").value = "";
            document.getElementById("dept").selectedIndex = 0;
            document.getElementById("status").selectedIndex = 0;
            document.getElementById("priority").selectedIndex = 0;
        });
    }

    /* Filters and sorting*/

    if (filterStatus) {
        filterStatus.addEventListener("change", updateTaskDisplay);
    }

    if (sortOption) {
        sortOption.addEventListener("change", updateTaskDisplay);
    }

    /* Display*/

    function updateTaskDisplay() {

        todayTasks.innerHTML = "";
        completedTasksContainer.innerHTML = "";

        let filteredTasks = [...taskList];

        if (filterStatus && filterStatus.value !== "all") {
            filteredTasks = filteredTasks.filter(
                task => task.status === filterStatus.value
            );
        }

        if (sortOption && sortOption.value === "name") {
            filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        }

        filteredTasks.forEach(task => {

            const taskElement = document.createElement("div");

            /* Colors depending on status*/

            let priorityClass = "";

            if (task.status === "complete") {
                priorityClass = "task-complete";
            } else if (task.priority === "low") {
                priorityClass = "task-low";
            } else if (task.priority === "medium") {
                priorityClass = "task-medium";
            } else if (task.priority === "high") {
                priorityClass = "task-high";
            }

            taskElement.className = `task-item ${priorityClass}`;

            /* Content*/

            taskElement.innerHTML = `
                <div>
                    <strong>${task.name}</strong>
                    <div>
                        Dept: ${task.dept} | 
                        Status: ${task.status} | 
                        Priority: ${task.priority}
                    </div>
                </div>
                <div class="mt-2">
                    ${task.status === "incomplete"
                        ? `<button class="btn btn-success me-2 complete-btn">✔ Completed</button>`
                        : ""}
                    <button class="btn btn-danger delete-btn">Delete</button>
                </div>
            `;

            /* Complete */

            const completeBtn = taskElement.querySelector(".complete-btn");

            if (completeBtn) {
                completeBtn.addEventListener("click", function () {
                    task.status = "complete";
                    saveTasksToLocalStorage();
                    updateTaskDisplay();
                    updateHomePageAlerts();
                    updateDashboardCounters();
                });
            }

            /* Delete */

            const deleteBtn = taskElement.querySelector(".delete-btn");

            deleteBtn.addEventListener("click", function () {
                const index = taskList.indexOf(task);
                if (index > -1) {
                    taskList.splice(index, 1);
                    saveTasksToLocalStorage();
                    updateTaskDisplay();
                    updateHomePageAlerts();
                    updateDashboardCounters();
                }
            });

            /* Takes the status and takes it to the correct section */

            if (task.status === "incomplete") {
                todayTasks.appendChild(taskElement);
            } else {
                completedTasksContainer.appendChild(taskElement);
            }
        });
    }

    /* Stores to local storage */

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    function loadTasksFromLocalStorage() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => taskList.push(task));
        updateTaskDisplay();
        updateDashboardCounters();
    }

    /* Homepage Counters */

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

    /* Updates the Homepage */

    function updateHomePageAlerts() {

        let criticalAlerts = [];
        let latestActivity = [];

        taskList.forEach(task => {

            if (task.priority === "high" && task.status === "incomplete") {
                criticalAlerts.push(`🔴 ${task.name} - Due: ${new Date(task.dueDate).toLocaleString()}`);
            }

            if (task.status === "complete") {
                latestActivity.push(`✅ ${task.name} completed on ${new Date(task.dueDate).toLocaleString()}`);
            }
        });

        localStorage.setItem("criticalAlerts", JSON.stringify(criticalAlerts));
        localStorage.setItem("latestActivity", JSON.stringify(latestActivity));
    }

    loadTasksFromLocalStorage();

});