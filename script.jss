// Typing animation
const words = ["AI Engineer", "Full Stack Developer", "Builder"];

let i = 0;
let j = 0;
let isDeleting = false;

function type() {
    let current = words[i];

    if (!isDeleting) {
        j++;
    } else {
        j--;
    }

    document.getElementById("dynamic-text").innerText =
        current.substring(0, j);

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && j === current.length) {
        isDeleting = true;
        speed = 1500;
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
    }

    setTimeout(type, speed);
}

type();


// Tilt effect
const box = document.getElementById("tilt-box");

box.addEventListener("mousemove", (e) => {
    const rect = box.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height/2)/20;
    const rotateY = (x - rect.width/2)/20;

    box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

box.addEventListener("mouseleave", () => {
    box.style.transform = "rotateX(0) rotateY(0)";
});
