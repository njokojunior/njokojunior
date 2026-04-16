const eyes = document.querySelectorAll(".eye");
const links = document.querySelectorAll(".menu a");
const sections = document.querySelectorAll(".page");

let currentIndex = 0;
let isScrolling = false;

const container = document.querySelector(".main-view");

function scrollToSection(index) {
  isScrolling = true;

  sections[index].scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  setTimeout(() => {
    isScrolling = false;
  }, 800); // match your CSS animation duration
}

// WHEEL SCROLL
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  if (e.deltaY > 0) {
    // scroll down
    if (currentIndex < sections.length - 1) {
      currentIndex++;
      scrollToSection(currentIndex);
    }
  } else {
    // scroll up
    if (currentIndex > 0) {
      currentIndex--;
      scrollToSection(currentIndex);
    }
  }
});

const removeLinkHighlight = () => {
  links.forEach((link) => link.classList.remove("active"));
};

links.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("href");
    removeLinkHighlight()
    if (target.startsWith("#")) {
      e.preventDefault();
      link.classList.add("active");
      currentIndex = index + 1; // because #home is not in menu
      scrollToSection(currentIndex);
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  },
  {
    threshold: 0.6, // triggers when 60% visible
  },
);

sections.forEach((section) => {
  observer.observe(section);
});

// track mouse movement
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// mouse movement
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateEyes() {
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

  requestAnimationFrame(animateEyes);
}

animateEyes();
