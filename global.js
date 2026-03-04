/* Storage */
window.getLocalStorageArray = function (key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("LocalStorage Parse Error:", error);
        return [];
    }
};

window.setLocalStorageArray = function (key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("LocalStorage Save Error:", error);
    }
};

/* Navbar Component */
const getNavbarHTML = () => `
    <nav class="navbar navbar-expand-lg main-header shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="logo.jpg" class="logo-img me-2" alt="logo">
                <span class="fw-bold fs-3">FreshTrack</span>
            </a>
            <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="menu">
                <ul class="navbar-nav nav-links align-items-lg-center">
                    <li class="nav-item"><a class="nav-link" href="tasks.html">Tasks</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                    <li class="nav-item"><a class="nav-link" href="report.html">Reports</a></li>
                    <li class="nav-item ms-lg-3">
                        <button id="darkModeToggle" class="btn btn-outline-info" aria-label="Toggle Dark Mode">
                            <i id="darkModeIcon" class="bi bi-moon-fill fs-4"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
`;
/* Footer Component */
const getFooterHTML = () => `
    <footer class="main-footer text-center p-4">
        <img src="logo.jpg" class="footer-logo mb-2" alt="logo">
        <p><a href="about.html" class="footer-link">About Us</a></p>
        <p class="mt-2">© 2026 FreshTrack Inc. All rights reserved.</p>
    </footer>
`;

/* Dark Mode Logic */
function initializeDarkMode() {
    const toggleBtn = document.getElementById("darkModeToggle");
    const toggleIcon = document.getElementById("darkModeIcon");
    const root = document.documentElement;
    const storageKey = "theme";

    if (!root) return;

    function applyTheme(theme) {
        if (theme === "dark") {
            root.classList.add("dark");
            if (toggleIcon) {
                toggleIcon.classList.remove("bi-moon-fill");
                toggleIcon.classList.add("bi-sun-fill");
            }
        } else {
            root.classList.remove("dark");
            if (toggleIcon) {
                toggleIcon.classList.remove("bi-sun-fill");
                toggleIcon.classList.add("bi-moon-fill");
            }
        }
    }

    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) applyTheme(savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            const isDark = root.classList.contains("dark");
            const newTheme = isDark ? "light" : "dark";
            localStorage.setItem(storageKey, newTheme);
            applyTheme(newTheme);
        });
    }
}

/* Orchestration */
document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("navbar-container");
    const footerContainer = document.getElementById("footer-container");
    if (navContainer) navContainer.innerHTML = getNavbarHTML();
    if (footerContainer) footerContainer.innerHTML = getFooterHTML();
    initializeDarkMode();
});

// Immediately apply saved theme to avoid flash
(function applySavedThemeImmediately() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
    }
})();
