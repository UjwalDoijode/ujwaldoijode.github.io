// ===== Cursor Glow =====
const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ===== Typing Animation =====
const words = ["AI Engineer", "Full Stack Developer", "Builder"];
let i = 0, j = 0, isDeleting = false;
const typing = document.getElementById("typing");

function type() {
  const current = words[i];

  if (isDeleting) j--;
  else j++;

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

// ===== Scroll Animation =====
const image = document.querySelector(".profile");
const content = document.querySelector(".content");
const glowBg = document.querySelector(".image-glow");

let current = 0;
let target = 0;

window.addEventListener("scroll", () => {
  target = window.scrollY / window.innerHeight;
});

function animate() {
  current += (target - current) * 0.08;

  const progress = Math.min(Math.max(current, 0), 1);

  // Image zoom + move
  const scale = 1 + progress * 0.4;
  const moveY = progress * -120;

  image.style.transform = `scale(${scale}) translateY(${moveY}px)`;

  // Text fade out
  content.style.opacity = 1 - progress * 1.2;
  content.style.transform = `translateY(${progress * -60}px)`;

  // Glow intensity
  glowBg.style.opacity = 0.5 + progress;

  requestAnimationFrame(animate);
}

animate();

// ===== 3D Tilt =====
document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 25;
  const y = (window.innerHeight / 2 - e.clientY) / 25;

  image.style.transform += ` rotateY(${x}deg) rotateX(${y}deg)`;
});
