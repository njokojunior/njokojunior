const eyes = document.querySelectorAll(".eye");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  eyes.forEach((eye) => {
    const pupil = eye.querySelector(".pupil");
    const rect = eye.getBoundingClientRect();

    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;

    const dx = mouseX - eyeX;
    const dy = mouseY - eyeY;

    const angle = Math.atan2(dy, dx);

    const maxMove = 5;

    const targetX = Math.cos(angle) * maxMove;
    const targetY = Math.sin(angle) * maxMove;

    let currentX = pupil._x || 0;
    let currentY = pupil._y || 0;

    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;

    pupil._x = currentX;
    pupil._y = currentY;

    pupil.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });

  requestAnimationFrame(animate);
}

animate();