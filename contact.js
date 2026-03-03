document.addEventListener("DOMContentLoaded", function () {

    /*Contact Form*/

    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const subject = document.getElementById("subject");
            const message = document.getElementById("message");

            let isValid = true;

            [name, email, subject, message].forEach(field => {
                field.classList.remove("is-invalid");
            });

            if (!name.value.trim()) {
                name.classList.add("is-invalid");
                isValid = false;
            }

            if (!email.value.trim() || !email.value.includes("@")) {
                email.classList.add("is-invalid");
                isValid = false;
            }

            if (!subject.value.trim()) {
                subject.classList.add("is-invalid");
                isValid = false;
            }

            if (!message.value.trim()) {
                message.classList.add("is-invalid");
                isValid = false;
            }

            if (!isValid) return;

            alert(
                `Thank you ${name.value}!\n\n` +
                `Your message has been received.\n\n` +
                `Subject: ${subject.value}\n` +
                `We will contact you at ${email.value}.`
            );

            form.reset();
        });
    }

   /* Dark Mode implementation*/

    const toggleBtn = document.getElementById("darkModeToggle");
    const toggleIcon = document.getElementById("darkModeIcon");
    const root = document.documentElement;
    const storageKey = "theme";

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
        toggleBtn.addEventListener("click", () => {
            const isDark = root.classList.contains("dark");
            const newTheme = isDark ? "light" : "dark";
            localStorage.setItem(storageKey, newTheme);
            applyTheme(newTheme);
        });
    }

});