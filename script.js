const body = document.body;
const nav = document.querySelector("nav");
const toggle = document.getElementById("themeToggle");

// PAGE FADE TRANSITIONS

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
});

document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    link.addEventListener("click", (e) => {
        e.preventDefault();

        document.body.classList.remove("loaded");
        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});

// Handle back/forward cache to prevent stuck fade-out state

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        document.body.classList.remove("fade-out");
        document.body.classList.add("loaded");
    }
});

// NAV HIDE ON SCROLL (mobile only optional)

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if (!nav) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
        nav.classList.add("nav-hidden");
    } else {
        nav.classList.remove("nav-hidden");
    }

    lastScrollY = currentScrollY;
});


// THEME SYSTEM (time + user override)

function updateIcon() {
    toggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
}

/* initial theme (keep your existing logic if you have time-based theme) */
const savedTheme = localStorage.getItem("theme");
const hour = new Date().getHours();

if (savedTheme) {
    body.classList.toggle("dark", savedTheme === "dark");
} else {
    if (hour >= 18 || hour < 6) {
        body.classList.add("dark");
    }
}

updateIcon();

/* click toggle */
toggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        body.classList.contains("dark") ? "dark" : "light"
    );

    updateIcon();
});

// LIGHTBOX

function openLightbox(img) {
    document.getElementById("lightbox-img").src = img.src;
    document.getElementById("lightbox").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.body.style.overflow = "";
}

document.addEventListener("keydown", function (event) {
    const lightbox = document.getElementById("lightbox");

    if (event.key === "Escape" && lightbox.style.display === "flex") {
        closeLightbox();
    }
});