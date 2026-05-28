const body = document.body;
const nav = document.querySelector("nav");
const toggle = document.getElementById("themeToggle");

document.getElementById("year").textContent = new Date().getFullYear();

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

    const lightbox = document.getElementById("lightbox");

    showImage();

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    lightbox.addEventListener("touchstart", handleTouchStart, { passive: true });
    lightbox.addEventListener("touchend", handleTouchEnd);
}

function showImage() {
    const img = document.getElementById("lightbox-img");
    img.src = currentGallery[currentIndex].src;

    // updateNavButtons();
    renderDots();
}

function closeLightbox(e) {
    if (e && e.target !== e.currentTarget) return;

    const lightbox = document.getElementById("lightbox");

    lightbox.classList.remove("active");
    document.body.style.overflow = "";

    lightbox.removeEventListener("touchstart", handleTouchStart);
    lightbox.removeEventListener("touchend", handleTouchEnd);
}

// function updateNavButtons() {
//     const leftBtn = document.querySelector("#lightbox .left");
//     const rightBtn = document.querySelector("#lightbox .right");

//     if (!currentGallery || currentGallery.length === 0) return;

//     leftBtn.style.display = currentIndex === 0 ? "none" : "block";
//     rightBtn.style.display = currentIndex === currentGallery.length - 1 ? "none" : "block";
// }

function updateNavButtons() {
    const leftBtn = document.querySelector(".lightbox-controls .nav:first-child");
    const rightBtn = document.querySelector(".lightbox-controls .nav:last-child");

    if (!currentGallery || currentGallery.length === 0) return;

    leftBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
    leftBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";

    rightBtn.style.opacity = currentIndex === currentGallery.length - 1 ? "0.3" : "1";
    rightBtn.style.pointerEvents = currentIndex === currentGallery.length - 1 ? "none" : "auto";
}

document.addEventListener("keydown", function (event) {
    const lightbox = document.getElementById("lightbox");

    if (event.key === "Escape" && lightbox.style.display === "flex") {
        closeLightbox();
    }
});

function nextImage() {
    if (currentIndex < currentGallery.length - 1) {
        currentIndex++;
        showImage("next");
    }
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        showImage("prev");
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
});

// Mobile swipe lightbox navigation

let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0) {
        if (currentIndex < currentGallery.length - 1) {
            currentIndex++;
            showImage("next");
        } else {
            edgeBounce("next");
        }
    } else {
        if (currentIndex > 0) {
            currentIndex--;
            showImage("prev");
        } else {
            edgeBounce("prev");
        }
    }
}

function edgeBounce(direction) {
    const img = document.getElementById(activeSlot === "A" ? "imgA" : "imgB");

    img.style.transition = "transform 0.15s ease";
    img.style.transform = direction === "next"
        ? "translateX(-8px)"
        : "translateX(8px)";

    setTimeout(() => {
        img.style.transform = "translateX(0)";
    }, 150);
}

function renderDots() {
    const container = document.getElementById("lightbox-dots");
    container.innerHTML = "";

    currentGallery.forEach((_, index) => {
        const dot = document.createElement("div");

        dot.classList.add("lightbox-dot");

        if (index === currentIndex) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = index;
            showImage();
        });

        container.appendChild(dot);
    });
}

// BACK TO TOP BUTTON

document.querySelectorAll('a[href="#top"]').forEach(el => {
    el.addEventListener("click", (e) => {
        e.preventDefault();

        document.getElementById("top").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// only shows after scrolling 

const btn = document.querySelector(".back-to-top-float");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
    } else {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
    }
});