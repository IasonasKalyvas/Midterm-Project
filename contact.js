document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const subjectField = document.getElementById("subject");
    const messageField = document.getElementById("message");
    
    const nameCounter = document.getElementById("nameCounter");
    const messageCounter = document.getElementById("messageCounter");

    // Live Character Counter Logic
    function updateCounter(field, counterElement, limit) {
        if (field && counterElement) {
            const length = field.value.length;
            counterElement.textContent = `(${length}/${limit})`;
        }
    }

    if (nameField && nameCounter) {
        nameField.addEventListener("input", () => updateCounter(nameField, nameCounter, 50));
    }
    if (messageField && messageCounter) {
        messageField.addEventListener("input", () => updateCounter(messageField, messageCounter, 200));
    }

    // Form Submission Logic
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;
            const fields = [nameField, emailField, subjectField, messageField];

            // Reset Styles
            fields.forEach(field => {
                if (field) field.classList.remove("is-invalid");
            });

            // Improved Email Validation (Regex ensures domain suffix exists)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Validation Checks
            if (!nameField.value.trim()) { nameField.classList.add("is-invalid"); isValid = false; }
            
            if (!emailField.value.trim() || !emailRegex.test(emailField.value)) { 
                emailField.classList.add("is-invalid"); 
                isValid = false; 
            }
            
            if (!subjectField.value.trim()) { subjectField.classList.add("is-invalid"); isValid = false; }
            if (!messageField.value.trim()) { messageField.classList.add("is-invalid"); isValid = false; }

            if (!isValid) return;

            // Success Action
            alert(
                `Thank you ${nameField.value}!\n\n` +
                `Your message has been received.\n\n` +
                `Subject: ${subjectField.value}\n` +
                `We will contact you at ${emailField.value}.`
            );

            form.reset();
            // Reset counters
            if (nameCounter) nameCounter.textContent = "(0/50)";
            if (messageCounter) messageCounter.textContent = "(0/200)";
        });
    }
});