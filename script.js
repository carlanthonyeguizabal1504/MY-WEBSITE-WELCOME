"use strict";

const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#site-nav");
const navLinks = [...document.querySelectorAll("nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const colorButton = document.querySelector(".color-button");
const backToTop = document.querySelector(".back-to-top");
const toast = document.querySelector(".toast");
let toastTimer;

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  navigation.classList.remove("open");
  body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  navigation.classList.toggle("open", !isOpen);
  body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

function updatePage() {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backToTop.classList.toggle("visible", window.scrollY > 600);

  let current = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) current = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updatePage, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 850) closeMenu();
  updatePage();
});

updatePage();

const savedAccent = localStorage.getItem("avengers-accent");
if (savedAccent === "red") body.classList.add("red-accent");

colorButton.addEventListener("click", () => {
  const isRed = body.classList.toggle("red-accent");
  localStorage.setItem("avengers-accent", isRed ? "red" : "blue");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelector("[data-copy-github]").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("fuzewuze1504");
    showToast("GitHub username copied.");
  } catch {
    showToast("GitHub: fuzewuze1504");
  }
});
