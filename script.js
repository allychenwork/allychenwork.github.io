const body = document.body;
const nav = document.querySelector("nav");
const toggle = document.getElementById("themeToggle");

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

// window.addEventListener("pageshow", () => {
//     const savedTheme = localStorage.getItem("theme");

//     if (savedTheme === "dark") {
//         document.documentElement.classList.add("dark");
//     } else {
//         document.documentElement.classList.remove("dark");
//     }
// });

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


// LIGHTBOX

let currentIndex = 0;
let currentGallery = [];

function openLightbox(img) {
    const galleryName = img.dataset.gallery;

    currentGallery = Array.from(
        document.querySelectorAll(`[data-gallery="${galleryName}"]`)
    );

    currentIndex = currentGallery.indexOf(img);

    showImage();

    document.getElementById("lightbox").classList.add("active");
    document.body.style.overflow = "hidden";
}

function showImage() {
    const img = document.getElementById("lightbox-img");
    img.src = currentGallery[currentIndex].src;
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
    document.body.style.overflow = "";
}

document.addEventListener("keydown", function (event) {
    const lightbox = document.getElementById("lightbox");

    if (event.key === "Escape" && lightbox.style.display === "flex") {
        closeLightbox();
    }
});

function nextImage() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showImage();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
});