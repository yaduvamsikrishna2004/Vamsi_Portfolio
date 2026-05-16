// Core DOM references
const loader = document.getElementById("loader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const year = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const progressBar = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const typingText = document.getElementById("typingText");
const cursorDot = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");
const mouseGlow = document.getElementById("mouseGlow");

// Loader
window.addEventListener("load", () => {
  loader.classList.add("hidden");
});

// Footer year
year.textContent = new Date().getFullYear();

// Mobile navigation
navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Active nav highlighting
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => sectionObserver.observe(section));

// Scroll progress and top button
const handleScrollUi = () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle("show", scrollTop > 450);
};

window.addEventListener("scroll", handleScrollUi, { passive: true });
handleScrollUi();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Theme toggle (default dark)
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  root.setAttribute("data-theme", "light");
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
});

// Typing animation
const typingPhrases = [
  "Building scalable applications for real-world impact.",
  "Designing AI-powered solutions with modern tooling.",
  "Crafting premium web experiences with clean engineering."
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function runTyping() {
  const current = typingPhrases[phraseIndex];
  typingText.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

  if (!deleting && charIndex > current.length + 1) {
    deleting = true;
    setTimeout(runTyping, 1250);
    return;
  }

  if (deleting && charIndex < 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  }

  const speed = deleting ? 26 : 52;
  setTimeout(runTyping, speed);
}
runTyping();

// Contact form validation
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function setFieldError(input, message) {
  const error = input.parentElement.querySelector(".error");
  error.textContent = message;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = ["name", "email", "subject", "message"].map((id) => document.getElementById(id));

  let valid = true;
  fields.forEach((field) => setFieldError(field, ""));

  fields.forEach((field) => {
    if (!field.value.trim()) {
      setFieldError(field, "This field is required.");
      valid = false;
    }
  });

  const emailInput = document.getElementById("email");
  if (emailInput.value && !validateEmail(emailInput.value.trim())) {
    setFieldError(emailInput, "Please enter a valid email.");
    valid = false;
  }

  if (!valid) {
    formStatus.textContent = "Please fix the highlighted fields and try again.";
    formStatus.style.color = "#ff7a9f";
    return;
  }

  formStatus.textContent = "Message validated successfully. Connect this form to Formspree or Netlify Forms to receive messages.";
  formStatus.style.color = "var(--success)";
  contactForm.reset();
});

// Project filtering
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.getAttribute("data-category") || "";
      const match = filter === "all" || categories.includes(filter);
      card.style.display = match ? "block" : "none";
    });
  });
});

// Counter animation
const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      let value = 0;
      const increment = target / 60;

      const ticker = setInterval(() => {
        value += increment;
        if (value >= target) {
          counter.textContent = Number.isInteger(target) ? String(target) : target.toFixed(2);
          clearInterval(ticker);
          observer.unobserve(counter);
          return;
        }
        counter.textContent = Number.isInteger(target) ? String(Math.floor(value)) : value.toFixed(2);
      }, 24);
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

// Custom cursor + mouse glow
if (window.matchMedia("(pointer:fine)").matches) {
  let cursorX = 0;
  let cursorY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
    mouseGlow.style.left = `${cursorX}px`;
    mouseGlow.style.top = `${cursorY}px`;
  });

  function animateOutline() {
    outlineX += (cursorX - outlineX) * 0.2;
    outlineY += (cursorY - outlineY) * 0.2;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  document.querySelectorAll("a, button, .project-card, .skill-card").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1.3)";
    });
    element.addEventListener("mouseleave", () => {
      cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

// Project tilt hover effect
projectCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = -((y / rect.height) - 0.5) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
});

// Mouse parallax for hero layers
const parallaxLayers = [...document.querySelectorAll(".parallax-layer")];
window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 20;
  const y = (event.clientY / window.innerHeight - 0.5) * 20;

  parallaxLayers.forEach((layer) => {
    const speed = Number(layer.dataset.speed || 0.05);
    layer.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

// Particle background
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  const count = Math.min(100, Math.floor(window.innerWidth / 16));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.6
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const theme = root.getAttribute("data-theme") || "dark";
  const color = theme === "dark" ? "150, 172, 255" : "90, 110, 180";

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) {
      p.vx *= -1;
    }
    if (p.y < 0 || p.y > canvas.height) {
      p.vy *= -1;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, 0.5)`;
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${color}, ${0.12 - distance / 1000})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
createParticles();
animateParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

// AOS and GSAP animations
AOS.init({
  once: true,
  duration: 850,
  easing: "ease-out-cubic"
});

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero__text > *", {
    y: 20,
    opacity: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: "power2.out"
  });

  gsap.to(".hero__bg-blur--one", {
    x: 24,
    y: 24,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".hero__bg-blur--two", {
    x: -26,
    y: -18,
    duration: 5.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.utils.toArray(".skill-card, .project-card, .timeline-item, .edu-card").forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 88%"
      },
      y: 32,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out"
    });
  });
}

