"use strict";
const API_BASE_URL = "/api";

// =========================================
// 1. HELPER FUNCTIONS
// =========================================

function getElement(id) {
    return document.getElementById(id);
}

function showMessage(element, message, type = "error") {
    if (!element) return;

    element.textContent = message;

    const colors = {
        success: "#287443",
        error: "#b42318",
        info: "#87553d"
    };

    element.style.color = colors[type] || colors.info;
}

async function readResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        try {
            return await response.json();
        } catch {
            return {};
        }
    }

    return { message: await response.text() };
}

function getErrorMessage(error) {
    if (error instanceof TypeError) {
        return "Backend connection nahi ho raha. Spring Boot start karo.";
    }

    return error.message || "Something went wrong.";
}

function getServerError(result, fallback) {
    return result?.detail ||
        result?.message ||
        result?.error ||
        fallback;
}

// Har API request ke saath session cookie bhejna
async function apiFetch(path, options = {}) {
    const headers = { ...(options.headers || {}) };

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include"
    });
}

// =========================================
// 2. MOBILE NAVBAR
// =========================================

const menuToggle = getElement("menuToggle");
const navLinks = getElement("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("show");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}

// =========================================
// 3. LOGIN / SIGNUP POPUP
// =========================================

const authOverlay = getElement("authOverlay");
const openAuth = getElement("openAuth");
const closeAuth = getElement("closeAuth");

function switchAuthForm(mode = "login") {
    const isLogin = mode === "login";

    const loginTab = getElement("authLoginTab");
    const signupTab = getElement("authSignupTab");
    const loginFormElement = getElement("authLoginForm");
    const signupFormElement = getElement("authSignupForm");

    if (loginTab) {
        loginTab.classList.toggle("active", isLogin);
    }

    if (signupTab) {
        signupTab.classList.toggle("active", !isLogin);
    }

    if (loginFormElement) {
        loginFormElement.classList.toggle("active", isLogin);
    }

    if (signupFormElement) {
        signupFormElement.classList.toggle("active", !isLogin);
    }

    showMessage(getElement("authLoginMessage"), "");
    showMessage(getElement("authSignupMessage"), "");
}

function openAuthPopup(mode = "login") {
    if (!authOverlay) return;

    authOverlay.classList.add("show");
    document.body.classList.add("auth-locked");

    switchAuthForm(mode);

    const firstInput = getElement(
        mode === "signup" ? "authFullName" : "authLoginEmail"
    );

    if (firstInput) firstInput.focus();
}

function closeAuthPopup() {
    if (!authOverlay) return;

    authOverlay.classList.remove("show");
    document.body.classList.remove("auth-locked");
}

if (openAuth) {
    openAuth.addEventListener("click", () => {
        openAuthPopup("login");
    });
}

if (closeAuth) {
    closeAuth.addEventListener("click", closeAuthPopup);
}

const loginTabButton = getElement("authLoginTab");
const signupTabButton = getElement("authSignupTab");

if (loginTabButton) {
    loginTabButton.addEventListener("click", () => {
        switchAuthForm("login");
    });
}

if (signupTabButton) {
    signupTabButton.addEventListener("click", () => {
        switchAuthForm("signup");
    });
}

if (authOverlay) {
    authOverlay.addEventListener("click", event => {
        if (event.target === authOverlay) {
            closeAuthPopup();
        }
    });
}

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        authOverlay?.classList.contains("show")
    ) {
        closeAuthPopup();
    }
});

// =========================================
// 4. SHOW / HIDE PASSWORD
// =========================================

document.querySelectorAll(".auth-show").forEach(button => {
    button.addEventListener("click", () => {
        const field = getElement(button.dataset.password);

        if (!field) return;

        const shouldShow = field.type === "password";

        field.type = shouldShow ? "text" : "password";
        button.textContent = shouldShow ? "Hide" : "Show";

        button.setAttribute(
            "aria-label",
            shouldShow ? "Hide password" : "Show password"
        );
    });
});

// =========================================
// 5. SIGNUP
// POST /api/auth/signup
// =========================================

const signupForm = getElement("authSignupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async event => {
        event.preventDefault();

        const message = getElement("authSignupMessage");

        const submitButton = signupForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const nameField = getElement("authFullName");
        const emailField = getElement("authSignupEmail");
        const passwordField = getElement("authSignupPassword");
        const confirmField = getElement("authConfirmPassword");

        if (!nameField || !emailField || !passwordField || !confirmField) {
            showMessage(
                message,
                "Signup form ke field IDs HTML mein check karo."
            );
            return;
        }

        const fullName = nameField.value.trim();
        const email = emailField.value.trim();
        const password = passwordField.value;
        const confirmPassword = confirmField.value;

        if (!fullName || !email || !password || !confirmPassword) {
            showMessage(message, "Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            showMessage(
                message,
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (submitButton) submitButton.disabled = true;

        showMessage(message, "Creating your account...", "info");

        try {
            const response = await apiFetch("/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    password: password
                })
            });

            const result = await readResponse(response);

            if (!response.ok) {
                console.error("Signup failed:", response.status, result);

                throw new Error(
                    getServerError(
                        result,
                        `Signup failed. Status: ${response.status}`
                    )
                );
            }

            showMessage(
                message,
                "Account created successfully! Please log in.",
                "success"
            );

            signupForm.reset();

            window.setTimeout(() => {
                switchAuthForm("login");

                const loginEmail = getElement("authLoginEmail");

                if (loginEmail) {
                    loginEmail.value = email;
                }
            }, 1000);

        } catch (error) {
            showMessage(message, getErrorMessage(error));
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}



// =========================================
// 6. LOGIN
// POST /api/auth/login
// =========================================

const loginForm = getElement("authLoginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const message = getElement("authLoginMessage");

        const submitButton = loginForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const emailField = getElement("authLoginEmail");
        const passwordField = getElement("authLoginPassword");

        if (!emailField || !passwordField) {
            showMessage(
                message,
                "Login form ke field IDs HTML mein check karo."
            );
            return;
        }

        const email = emailField.value.trim();
        const password = passwordField.value;

        if (!email || !password) {
            showMessage(message, "Please enter email and password.");
            return;
        }

        if (submitButton) submitButton.disabled = true;

        showMessage(message, "Verifying login...", "info");

        try {
            const response = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const result = await readResponse(response);

            if (!response.ok) {
                console.error("Login failed:", response.status, result);

                throw new Error(
                    getServerError(
                        result,
                        `Login failed. Status: ${response.status}`
                    )
                );
            }

            // Login ke baad server session check karo
            const sessionValid = await updateNavbarAuth();

if (!sessionValid) {
    showMessage(
        message,
        "Login request successful, lekin /auth/me session verify nahi kar paaya. Console check karo.",
        "error"
    );
    console.error(
        "Login response:",
        result,
        "Session verification failed."
    );
    return;
}

            showMessage(message, "Login successful!", "success");

            window.setTimeout(() => {
                closeAuthPopup();
            }, 700);

        } catch (error) {
            showMessage(message, getErrorMessage(error));
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

// =========================================
// 7. BOOKING FORM
// POST /api/bookings
// =========================================
/*/api/bookings
const bookingForm = getElement("bookingForm");
const bookingStatus = getElement("bookingStatus");

if (bookingForm) {
    const eventDateInput = getElement("eventDate");

    function setMinimumEventDate() {
        if (!eventDateInput) return;

        const now = new Date();

        eventDateInput.min = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("-");
    }

    setMinimumEventDate();

    bookingForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        const getValue = id => {
            const field = getElement(id);
            return field ? field.value.trim() : "";
        };

        const data = {
            fullName: getValue("fullName"),
            email: getValue("email"),
            phone: getValue("phone"),
            eventType: getValue("eventType"),
            eventDate: getValue("eventDate"),
            guests: getValue("guests"),
            city: getValue("city"),
            venue: getValue("venue"),
            budget: getValue("budget"),
            packageName: getValue("package"),
            details: getValue("details")
        };

        const submitButton = bookingForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (submitButton) submitButton.disabled = true;

        showMessage(
            bookingStatus,
            "Submitting your booking enquiry...",
            "info"
        );

        try {
            const response = await apiFetch("/bookings", {
                method: "POST",
                body: JSON.stringify(data)
            });

            const result = await readResponse(response);

            if (!response.ok) {
                console.error("Booking failed:", response.status, result);

                throw new Error(
                    getServerError(
                        result,
                        `Booking submission failed. Status: ${response.status}`
                    )
                );
            }

            showMessage(
                bookingStatus,
                `Thank you, ${result.fullName || data.fullName}! ` +
                `Your enquiry has been saved. Booking ID: ${result.id ?? "N/A"}. ` +
                `Status: ${result.status || "PENDING"}.`,
                "success"
            );

            bookingForm.reset();
            setMinimumEventDate();

        } catch (error) {
            showMessage(bookingStatus, getErrorMessage(error));
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}
*/
// =========================================
// 8. CONTACT FORM
// Abhi frontend demo hai
// =========================================

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        const contact = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            subject: String(formData.get("subject") || "").trim(),
            message: String(formData.get("message") || "").trim()
        };

        const submitButton = contactForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (submitButton) submitButton.disabled = true;

        if (contactStatus) {
            contactStatus.textContent = "Sending your message...";
            contactStatus.style.color = "#87553d";
        }

        try {
            const response = await apiFetch("/contact", {
                method: "POST",
                body: JSON.stringify(contact)
            });

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getServerError(
                        result,
                        `Message submit nahi hua. Status: ${response.status}`
                    )
                );
            }

            if (contactStatus) {
                contactStatus.textContent =
                    "Thank you! Your message has been submitted successfully.";
                contactStatus.style.color = "#287443";
            } else {
                alert("Your message has been submitted successfully!");
            }

            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            const message = getErrorMessage(error);

            if (contactStatus) {
                contactStatus.textContent = message;
                contactStatus.style.color = "#b42318";
            } else {
                alert(message);
            }

        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

// =========================================
// 9. FOOTER YEAR
// =========================================

const currentYear = getElement("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// =========================================
// 10. NAVBAR AUTHENTICATION
// GET /api/auth/me
// =========================================

async function updateNavbarAuth() {
    const loginButton = getElement("openAuth");
    const avatar = getElement("profileAvatar");
    const initial = getElement("profileInitial");

    if (!loginButton || !avatar) {
        console.warn(
            "Navbar mein openAuth ya profileAvatar element nahi mila."
        );
        return false;
    }

    try {
      const response = await apiFetch("/profile", {
    method: "GET"
});

        console.log("GET /profile status:", response.status);

        if (response.status === 401 || response.status === 403) {
            loginButton.hidden = false;
            avatar.hidden = true;
            return false;
        }

        const result = await readResponse(response);

        if (!response.ok) {
            console.error(
                "/profile failed:",
                response.status,
                result
            );

            loginButton.hidden = false;
            avatar.hidden = true;
            return false;
        }

        const user = result?.user || result?.data?.user || result;

        const fullName =
            typeof user?.fullName === "string"
                ? user.fullName.trim()
                : "";

        // Logged in: button hide, avatar show
        loginButton.hidden = true;
        avatar.hidden = false;

        if (initial) {
            initial.textContent = fullName
                ? fullName.charAt(0).toUpperCase()
                : "👤";
        }

        console.log("Navbar auth user:", user);

        return true;

    } catch (error) {
        console.error("Navbar auth request failed:", error);

        loginButton.hidden = false;
        avatar.hidden = true;

        return false;
    }
}

// Avatar click -> profile page
const profileAvatar = getElement("profileAvatar");

if (profileAvatar) {
    profileAvatar.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

// Page load par login status check karo
updateNavbarAuth();

// EventAura mobile navbar toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();

    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  document.addEventListener("click", function (event) {
    if (!navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }
  });
});