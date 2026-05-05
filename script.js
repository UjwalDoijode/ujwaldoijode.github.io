// ============================
// 🔤 TYPING EFFECT (SMOOTHER)
// ============================
const words = ["AI Engineer", "Full Stack Developer", "Builder"];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        charIndex++;
    } else {
        charIndex--;
    }

    document.getElementById("dynamic-text").innerText =
        currentWord.substring(0, charIndex);

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
    }

    setTimeout(type, speed);
}

window.addEventListener("load", () => {
    setTimeout(type, 800);
});


// ============================
// 🎯 TILT EFFECT (SMOOTH)
// ============================
const box = document.getElementById("tilt-box");

if (box) {
    box.addEventListener("mousemove", (e) => {
        const rect = box.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = -(y - rect.height / 2) / 25;
        const rotateY = (x - rect.width / 2) / 25;

        box.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.03)
        `;
    });

    box.addEventListener("mouseleave", () => {
        box.style.transform = `
            perspective(1000px)
            rotateX(0)
            rotateY(0)
            scale(1)
        `;
    });
}


// ============================
// 🌟 GLOW FOLLOW (PREMIUM)
// ============================
const glow = document.querySelector(".glow-bg");

document.addEventListener("mousemove", (e) => {
    if (!glow) return;

    const x = e.clientX;
    const y = e.clientY;

    glow.style.left = x - 200 + "px";
    glow.style.top = y - 200 + "px";
});


// ============================
// ✨ PAGE LOAD FADE-IN
// ============================
document.body.style.opacity = 0;

window.addEventListener("load", () => {
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = 1;
});
