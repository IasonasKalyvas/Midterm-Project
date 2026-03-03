document.addEventListener("DOMContentLoaded", function () {

    /* Dynamic Date Updating */

    const dateElement = document.getElementById("dynamicDate");
    if (dateElement) {
        dateElement.textContent = new Date().toDateString();
    }

    /* Loads the Dashboard (gets the tasks) */

    function loadDashboard() {

        const today = document.getElementById("tasksToday");
        const overdue = document.getElementById("tasksOverdue");
        const completed = document.getElementById("tasksCompleted");

        if (today) today.textContent = localStorage.getItem("tasksToday") || 0;
        if (overdue) overdue.textContent = localStorage.getItem("tasksOverdue") || 0;
        if (completed) completed.textContent = localStorage.getItem("tasksCompleted") || 0;

        const alerts = JSON.parse(localStorage.getItem("criticalAlerts")) || [];
        const activity = JSON.parse(localStorage.getItem("latestActivity")) || [];

        const alertList = document.getElementById("criticalAlerts");
        const activityList = document.getElementById("latestActivity");

        if (alertList) {
            alertList.innerHTML = "";
            alerts.forEach(a => {
                let li = document.createElement("li");
                li.innerHTML = `${a} 
                <button class="btn btn-danger btn-sm" onclick="deleteAlert('${a}')">🗑️</button>`;
                alertList.appendChild(li);
            });
        }

        if (activityList) {
            activityList.innerHTML = "";
            activity.forEach(a => {
                let li = document.createElement("li");
                li.innerHTML = `${a} 
                <button class="btn btn-danger btn-sm" onclick="deleteActivity('${a}')">🗑️</button>`;
                activityList.appendChild(li);
            });
        }
    }

    loadDashboard();

    /* Remove a task if I want to */

    function removeTaskFromStorage(taskName) {

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks = tasks.filter(task => task.name !== taskName);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        return tasks;
    }

    /* Updates counters in the index page*/

    function updateCountersAfterDelete(type) {

        let tasksToday = parseInt(localStorage.getItem("tasksToday")) || 0;
        let overdue = parseInt(localStorage.getItem("tasksOverdue")) || 0;
        let completed = parseInt(localStorage.getItem("tasksCompleted")) || 0;

        // Always decrease Tasks Today
        tasksToday = Math.max(0, tasksToday - 1);

        if (type === "critical") {
            overdue = Math.max(0, overdue - 1);
        }

        if (type === "completed") {
            completed = Math.max(0, completed - 1);
        }

        localStorage.setItem("tasksToday", tasksToday);
        localStorage.setItem("tasksOverdue", overdue);
        localStorage.setItem("tasksCompleted", completed);
    }

    /* Delete critical alerts from index*/

    window.deleteAlert = function (alertText) {

        let alerts = JSON.parse(localStorage.getItem("criticalAlerts")) || [];
        alerts = alerts.filter(alert => alert !== alertText);
        localStorage.setItem("criticalAlerts", JSON.stringify(alerts));

        const taskName = alertText.replace(/^🔴\s*/, "").split(" - ")[0];

        removeTaskFromStorage(taskName);
        updateCountersAfterDelete("critical");

        loadDashboard();
    };

    /* Delete activities */

    window.deleteActivity = function (activityText) {

        let activity = JSON.parse(localStorage.getItem("latestActivity")) || [];
        activity = activity.filter(act => act !== activityText);
        localStorage.setItem("latestActivity", JSON.stringify(activity));

        const taskName = activityText.replace(/^✅\s*/, "").split(" completed")[0];

        removeTaskFromStorage(taskName);
        updateCountersAfterDelete("completed");

        loadDashboard();
    };

    /* Weather API functionality using API key (probably should hide the key)*/

    const APIKEY = "a527000cc79dbf856749c6a8fbfc9f63";
    const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    const searchBox = document.getElementById("city");
    const searchBtn = document.getElementById("btn");

    async function checkWeather(city = "Athens") {
        try {
            const response = await fetch(
                `${BASE_URL}?q=${city}&units=metric&appid=${APIKEY}`
            );

            const data = await response.json();

            if (response.status !== 200) {
                alert("City not found or API issue.");
                return;
            }

            document.querySelector(".temp").textContent =
                Math.floor(data.main.temp) + "°C";

            document.querySelector(".city").textContent =
                data.name + ", " + data.sys.country;

            document.querySelector(".humidity").textContent =
                data.main.humidity + "%";

            document.querySelector(".wind").textContent =
                data.wind.speed + " Km/h";

        } catch (error) {
            alert("Unable to fetch weather data.");
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const city = searchBox.value.trim();
            checkWeather(city || "Athens");
        });
    }

    if (searchBox) {
        searchBox.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                const city = searchBox.value.trim();
                checkWeather(city || "Athens");
            }
        });
    }

    checkWeather("Athens");

    /* Dark Mode implementation*/

    const toggleBtn = document.getElementById("darkModeToggle");
    const toggleIcon = document.getElementById("darkModeIcon");
    const root = document.documentElement;
    const storageKey = "theme";

    function applyTheme(theme) {
        if (theme === "dark") {
            root.classList.add("dark");
            toggleIcon.classList.remove("bi-moon-fill");
            toggleIcon.classList.add("bi-sun-fill");
        } else {
            root.classList.remove("dark");
            toggleIcon.classList.remove("bi-sun-fill");
            toggleIcon.classList.add("bi-moon-fill");
        }
    }

    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) applyTheme(savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isDark = root.classList.contains("dark");
            const newTheme = isDark ? "light" : "dark";
            localStorage.setItem(storageKey, newTheme);
            applyTheme(newTheme);
        });
    }

});