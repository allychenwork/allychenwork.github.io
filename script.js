const body = document.body;
const nav = document.querySelector("nav");
const toggle = document.getElementById("themeToggle");

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

const savedTheme = localStorage.getItem("theme");
const hour = new Date().getHours();

if (savedTheme) {
    body.classList.toggle("dark", savedTheme === "dark");
} else {
    if (hour >= 18 || hour < 6) {
        body.classList.add("dark");
    }
}

/* toggle button */
if (toggle) {
    toggle.addEventListener("click", () => {
        body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            body.classList.contains("dark") ? "dark" : "light"
        );
    });
}

// PAGE FADE TRANSITIONS

document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    // ignore external links + anchors
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    link.addEventListener("click", function (e) {
        e.preventDefault();

        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = href;
        }, 300); // match CSS duration
    });
});

window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("fade-out");
});