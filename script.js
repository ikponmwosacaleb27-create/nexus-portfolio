
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Update the footer year.
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Theme switcher.
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function setTheme(theme) {
    const isLight = theme === "light";
    body.classList.toggle("light-theme", isLight);

    if (themeIcon) themeIcon.textContent = isLight ? "☾" : "☼";
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      themeToggle.title = isLight ? "Switch to dark theme" : "Switch to light theme";
    }

    try {
      localStorage.setItem("nexus-theme", theme);
    } catch (error) {
      // The theme still works if browser storage is unavailable.
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("nexus-theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(body.classList.contains("light-theme") ? "dark" : "light");
    });
  }

  // Mobile navigation.
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Project filtering.
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectCount = document.getElementById("projectCount");

  function filterProjects(category) {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const show = category === "all" || categories.includes(category);

      card.classList.toggle("is-hidden", !show);
      card.setAttribute("aria-hidden", String(!show));
      card.tabIndex = show ? 0 : -1;

      if (show) visibleCount++;
    });

    if (projectCount) {
      projectCount.textContent =
        "SHOWING " + String(visibleCount).padStart(2, "0") + " PROJECTS";
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      filterProjects(button.dataset.category || "all");
    });
  });

  filterButtons.forEach(button => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  // Project case studies.
  const projects = {
    breeze: {
      number: "PROJECT / 01",
      title: "B.R.E.E.Z.E",
      description:
        "B.R.E.E.Z.E is a personal AI assistant project powered by the WhisperOS concept. The goal is to combine conversational AI, voice interaction and useful Android controls in one thoughtful experience. The design prioritises practical capabilities, clear permission boundaries and a lightweight approach suited to mobile hardware. This project is in development.",
      tags: ["AI", "Android", "WhisperOS", "Voice interaction"]
    },
    vyro: {
      number: "PROJECT / 02",
      title: "VYRO",
      description:
        "VYRO is a cinematic movie discovery app built around browsing, searching and saving films. Its interface explores featured titles, genre collections and a personal watchlist, with movie catalogue data powered by TMDB. The focus is on making discovery feel polished and straightforward while the app continues to evolve.",
      tags: ["Kotlin", "Jetpack Compose", "TMDB", "Mobile UI"]
    },
    lumina: {
      number: "PROJECT / 03",
      title: "LUMINA",
      description:
        "LUMINA explores an accessible creative workspace for AI-assisted visual generation. The idea is to make experimenting with image concepts feel approachable, with a clear path from imagination to a finished visual. It represents an ongoing interest in creative tools and visual technology.",
      tags: ["Creative AI", "Visuals", "Design", "Experimentation"]
    },
    ruby: {
      number: "PROJECT / 04",
      title: "RUBY",
      description:
        "RUBY is an AI assistant project exploring conversation, useful actions, memory and an interface that feels personal. It brings together experiments in language-model integration and Android interaction. It is part of a wider exploration into making AI useful beyond a simple chat window.",
      tags: ["AI", "Assistant", "Automation", "Android"]
    }
  };

  const dialog = document.getElementById("projectDialog");
  const dialogClose = document.getElementById("dialogClose");
  const dialogKicker = document.getElementById("dialogKicker");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogDescription = document.getElementById("dialogDescription");
  const dialogTags = document.getElementById("dialogTags");

  function openProject(projectKey) {
    const project = projects[projectKey];
    if (!project || !dialog) return;

    if (dialogKicker) dialogKicker.textContent = project.number;
    if (dialogTitle) dialogTitle.textContent = project.title;
    if (dialogDescription) dialogDescription.textContent = project.description;

    if (dialogTags) {
      dialogTags.replaceChildren();

      project.tags.forEach(tag => {
        const chip = document.createElement("span");
        chip.textContent = tag;
        dialogTags.appendChild(chip);
      });
    }

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      openProject(button.dataset.open);
    });
  });

  projectCards.forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      openProject(card.dataset.project);
    });

    card.addEventListener("keydown", event => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        event.target === card
      ) {
        event.preventDefault();
        openProject(card.dataset.project);
      }
    });
  });

  if (dialogClose && dialog) {
    dialogClose.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });

    dialog.addEventListener("click", event => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const outside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;

        if (outside && typeof dialog.close === "function") {
          dialog.close();
        }
      }
    });
  }

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -25px 0px"
    });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Highlight the navigation link for the visible section.
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navItems.forEach(link => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", active);
        });
      });
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Contact form.
  // Replace this placeholder with your own email address.
  const YOUR_EMAIL = "YOUR_EMAIL_HERE@example.com";

  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      if (
        YOUR_EMAIL === "YOUR_EMAIL_HERE@example.com" ||
        !YOUR_EMAIL.includes("@")
      ) {
        if (formNote) {
          formNote.textContent =
            "Almost ready! Add your real email address in script.js to activate this form.";
        }
        return;
      }

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const subject = encodeURIComponent("Portfolio message from " + name);
      const bodyText = [
        "Name: " + name,
        "Email: " + email,
        "",
        "Message:",
        message
      ].join("\n");

      const mailto =
        "mailto:" + YOUR_EMAIL +
        "?subject=" + subject +
        "&body=" + encodeURIComponent(bodyText);

      if (formNote) {
        formNote.textContent =
          "Opening your email app. Review the message and press Send.";
      }

      window.location.href = mailto;
    });
  }
});
