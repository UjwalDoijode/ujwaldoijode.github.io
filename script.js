// ===== Cursor Glow =====
const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ===== Typing Animation =====
const words = ["AI Engineer", "Full Stack Developer", "Builder"];
let i = 0;
let j = 0;
let isDeleting = false;

const typing = document.getElementById("typing");

function type() {
  const current = words[i];

  if (isDeleting) {
    j--;
  } else {
    j++;
  }

  typing.textContent = current.substring(0, j);

  if (!isDeleting && j === current.length) {
    isDeleting = true;
    setTimeout(type, 1000);
    return;
  }

  if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % words.length;
  }

  setTimeout(type, isDeleting ? 50 : 100);
}

type();

// ===== 3D Tilt Effect =====
const card = document.querySelector(".profile");

document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 25;
  const y = (window.innerHeight / 2 - e.clientY) / 25;

  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg) scale(1.05)`;
});
