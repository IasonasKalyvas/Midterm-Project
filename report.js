document.addEventListener("DOMContentLoaded", function () {

    /* -------- Animate Department Bars -------- */
    document.getElementById("storageBar").style.width = "90%";
    document.getElementById("cashiersBar").style.width = "70%";
    document.getElementById("cleaningBar").style.width = "80%";

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

    toggleBtn.addEventListener("click", () => {
        const isDark = root.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";
        localStorage.setItem(storageKey, newTheme);
        applyTheme(newTheme);
    });

});