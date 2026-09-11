"use strict";

const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const navLinks = [...document.querySelectorAll("nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const progressBar = document.querySelector(".scroll-progress span");
const backToTop = document.querySelector(".back-to-top");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
  body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("open", willOpen);
  body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

function updateScrollUI() {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
  progressBar.style.width = `${scrollPercent}%`;
  header.classList.toggle("scrolled", window.scrollY > 12);
  backToTop.classList.toggle("visible", window.scrollY > 550);

  let currentSection = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 170) currentSection = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 850) closeMenu();
  updateScrollUI();
});
updateScrollUI();

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const modeButton = document.querySelector(".mode-toggle");
const modeLabel = document.querySelector(".mode-label");
const savedMode = localStorage.getItem("avengers-energy-mode");

if (savedMode === "red") {
  body.classList.add("red-mode");
  modeLabel.textContent = "REPULSOR RED";
}

modeButton.addEventListener("click", () => {
  const redMode = body.classList.toggle("red-mode");
  modeLabel.textContent = redMode ? "REPULSOR RED" : "ARC BLUE";
  localStorage.setItem("avengers-energy-mode", redMode ? "red" : "blue");
  showToast(redMode ? "Repulsor energy activated." : "Arc energy activated.");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();

      function count(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(count);
      }

      requestAnimationFrame(count);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const cursorGlow = document.querySelector(".cursor-glow");
window.addEventListener(
  "pointermove",
  (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  },
  { passive: true }
);

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    });
  });
}

const phaseContent = {
  discover: {
    number: "PHASE 01",
    title: "Discover the mission",
    text: "Define the goal, audience, content, and exact problem the website must solve.",
    progress: "25%",
  },
  design: {
    number: "PHASE 02",
    title: "Design the system",
    text: "Plan the layout, visual hierarchy, color system, and behavior for every screen size.",
    progress: "50%",
  },
  build: {
    number: "PHASE 03",
    title: "Assemble the experience",
    text: "Turn the design into structured HTML, responsive CSS, and purposeful JavaScript.",
    progress: "75%",
  },
  launch: {
    number: "PHASE 04",
    title: "Test and deploy",
    text: "Verify links, interactions, accessibility, and mobile behavior before releasing the site.",
    progress: "100%",
  },
};

const labOutput = document.querySelector(".lab-output");
document.querySelectorAll("[data-phase]").forEach((button) => {
  button.addEventListener("click", () => {
    const phase = phaseContent[button.dataset.phase];
    document.querySelectorAll("[data-phase]").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    labOutput.querySelector("span").textContent = phase.number;
    labOutput.querySelector("h4").textContent = phase.title;
    labOutput.querySelector("p").textContent = phase.text;
    labOutput.querySelector("i").style.setProperty("--progress", phase.progress);
  });
});

const serviceContent = {
  responsive: {
    title: "Responsive Web Design",
    description:
      "A responsive build keeps the same identity and core experience while adapting its layout, spacing, navigation, and controls to the visitor's screen.",
    details: ["Mobile-first", "Flexible grid", "Touch-ready"],
  },
  interactive: {
    title: "Interactive Experiences",
    description:
      "Thoughtful interactions guide visitors, confirm their actions, and make the interface feel faster without distracting from its purpose.",
    details: ["Live feedback", "Motion cues", "Form states"],
  },
  interface: {
    title: "Interface Concepts",
    description:
      "A visual system connects typography, colors, surfaces, spacing, and reusable components so every part of the page feels intentional.",
    details: ["UI hierarchy", "Design tokens", "Component style"],
  },
};

const serviceModal = document.querySelector("#service-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalDetails = document.querySelector("#modal-details");

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  body.classList.add("modal-open");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
  body.classList.remove("modal-open");
}

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    const service = serviceContent[button.dataset.service];
    modalTitle.textContent = service.title;
    modalDescription.textContent = service.description;
    modalDetails.replaceChildren(
      ...service.details.map((detail) => {
        const item = document.createElement("span");
        item.textContent = detail;
        return item;
      })
    );
    openDialog(serviceModal);
  });
});

document.querySelectorAll(".modal").forEach((dialog) => {
  dialog.querySelector(".modal-close").addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => body.classList.remove("modal-open"));
});

const missionConsole = document.querySelector("#mission-console");
const consoleScreen = missionConsole.querySelector(".console-screen");

document.querySelector("[data-open-console]").addEventListener("click", () => openDialog(missionConsole));

document.querySelectorAll("[data-console-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.consoleTarget;
    const labels = {
      about: "Scanning project origin... access granted.",
      services: "Loading digital abilities... access granted.",
      creator: "Verifying creator identity... access granted.",
    };
    consoleScreen.replaceChildren();
    const lineOne = document.createElement("p");
    const lineTwo = document.createElement("p");
    lineOne.textContent = `> ${labels[target]}`;
    lineTwo.textContent = "> Redirecting now...";
    consoleScreen.append(lineOne, lineTwo);
    window.setTimeout(() => {
      closeDialog(missionConsole);
      document.querySelector(`#${target}`).scrollIntoView({ behavior: "smooth" });
    }, 650);
  });
});

document.querySelector("[data-copy-name]").addEventListener("click", async () => {
  const name = "Carl Anthony A. Eguizabal";
  try {
    await navigator.clipboard.writeText(name);
    showToast("Creator name copied to clipboard.");
  } catch {
    showToast(name);
  }
});

const contactForm = document.querySelector("#contact-form");
const messageBox = contactForm.elements.message;
const charCount = document.querySelector(".char-count");
const missionLog = document.querySelector("#mission-log");
const missionList = missionLog.querySelector("ul");
const storageKey = "avengers-local-transmissions";

function getTransmissions() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function renderTransmissions() {
  const transmissions = getTransmissions();
  missionList.replaceChildren();
  missionLog.hidden = transmissions.length === 0;
  transmissions.forEach((transmission) => {
    const item = document.createElement("li");
    const sender = document.createElement("strong");
    sender.textContent = transmission.name;
    item.append(sender, document.createTextNode(` · ${transmission.type} · ${transmission.date}`));
    missionList.append(item);
  });
}

messageBox.addEventListener("input", () => {
  charCount.textContent = `${messageBox.value.length} / 300`;
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll("input, select, textarea")];
  fields.forEach((field) => field.classList.remove("field-error"));

  const invalidFields = fields.filter((field) => !field.checkValidity());
  if (invalidFields.length) {
    invalidFields.forEach((field) => field.classList.add("field-error"));
    invalidFields[0].focus();
    showToast("Complete the highlighted transmission fields.");
    return;
  }

  const formData = new FormData(contactForm);
  const transmissions = getTransmissions();
  transmissions.unshift({
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim(),
    type: String(formData.get("type")),
    message: String(formData.get("message")).trim(),
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
  });
  localStorage.setItem(storageKey, JSON.stringify(transmissions.slice(0, 5)));
  contactForm.reset();
  charCount.textContent = "0 / 300";
  renderTransmissions();
  showToast("Transmission saved to this browser.");
});

document.querySelector("[data-clear-log]").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  renderTransmissions();
  showToast("Local mission log cleared.");
});

renderTransmissions();
