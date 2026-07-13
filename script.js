const eyes = document.querySelectorAll(".eye");
const navLinks = document.querySelectorAll(".menu a[href^='#']");
const sections = document.querySelectorAll(".page");
const allJumpLinks = document.querySelectorAll("a[href^='#']");
const scrollProgress = document.getElementById("scrollProgress");
const footerYear = document.getElementById("footerYear");

const sectionIndexById = (id) =>
  Array.from(sections).findIndex((s) => s.id === id);

let currentIndex = 0;
let isScrolling = false;

// If the page loads on a specific hash (e.g. a direct link to #skills),
// make sure currentIndex starts in sync so the next wheel scroll goes the
// right direction instead of assuming we're still on #home.
const initialHash = window.location.hash.replace("#", "");
const initialIdx = Array.from(sections).findIndex((s) => s.id === initialHash);
if (initialIdx !== -1) currentIndex = initialIdx;

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

function updateProgress(index) {
  if (!scrollProgress) return;
  const pct = ((index + 1) / sections.length) * 100;
  scrollProgress.style.width = `${pct}%`;
}

// WHEEL SCROLL (desktop paging between sections)
window.addEventListener("wheel", (e) => {
  if (isScrolling) return;
  if (window.innerWidth <= 900) return; // let mobile scroll natively

  if (e.deltaY > 0) {
    // scroll down
    if (currentIndex < sections.length - 1) {
      currentIndex++;
      scrollToSection(currentIndex);
      updateProgress(currentIndex);
    }
    // if already on the last section, let the native scroll continue to the footer
  } else {
    // scroll up
    if (currentIndex > 0) {
      currentIndex--;
      scrollToSection(currentIndex);
      updateProgress(currentIndex);
    }
  }
});

const removeLinkHighlight = () => {
  navLinks.forEach((link) => link.classList.remove("active"));
};

allJumpLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("href");
    if (!target || target === "#") return; // placeholder buttons (e.g. Download CV)

    const targetId = target.slice(1);
    const idx = sectionIndexById(targetId);
    if (idx === -1) return;

    e.preventDefault();
    removeLinkHighlight();
    const matchingNavLink = document.querySelector(`.menu a[href="#${targetId}"]`);
    if (matchingNavLink) matchingNavLink.classList.add("active");

    currentIndex = idx;
    scrollToSection(currentIndex);
    updateProgress(currentIndex);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    // toggle the fade/reveal class independently for every section
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });

    // Nav highlighting + progress bar are cosmetic only: sync them to
    // whichever section is currently most visible. currentIndex itself is
    // NOT touched here — it stays owned by the wheel/click handlers so the
    // two never fight over which section is "current" mid-transition.
    let mostVisible = null;
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio)
      ) {
        mostVisible = entry;
      }
    });

    if (mostVisible) {
      const id = mostVisible.target.getAttribute("id");
      removeLinkHighlight();
      const matchingLink = document.querySelector(`.menu a[href="#${id}"]`);
      if (matchingLink) matchingLink.classList.add("active");

      const idx = Array.from(sections).findIndex((s) => s.id === id);
      if (idx !== -1) updateProgress(idx);
    }
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

// footer year
if (footerYear) {
  const year = new Date().getFullYear();
  footerYear.textContent = `© ${year} Njoko Junior. All rights reserved.`;
}
