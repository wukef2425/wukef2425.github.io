const STORAGE_KEY = "portfolio-language";

function getInitialLanguage() {
  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);

  if (savedLanguage === "zh" || savedLanguage === "en") {
    return savedLanguage;
  }

  return window.siteContent.defaultLanguage;
}

function resolveText(path, language) {
  const segments = path.split(".");
  let current = {
    ...window.siteContent.translations[language],
    site: window.siteContent.site,
  };

  for (const segment of segments) {
    current = current?.[segment];
  }

  if (typeof current === "object" && current !== null && language in current) {
    return current[language];
  }

  return current;
}

function renderStaticText(language) {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((element) => {
    const key = element.dataset.i18n;
    const value = resolveText(key, language);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });
}

function renderHighlights(language) {
  const list = document.getElementById("highlights-list");
  const items = window.siteContent.translations[language].hero.highlights;

  list.innerHTML = items
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderMarquee(language) {
  const marquee = document.getElementById("hero-marquee");
  const label = window.siteContent.translations[language].hero.marquee;
  const items = Array.from({ length: 10 }, () => `<span>${label}</span>`).join("");

  marquee.innerHTML = `<div class="marquee-track">${items}${items}</div>`;
}

function renderProjects(language) {
  const grid = document.getElementById("projects-grid");
  const label = window.siteContent.translations[language].projects.viewLabel;

  grid.innerHTML = window.siteContent.projects
    .map(
      (project) => `
        <article class="project-card">
          <p class="project-meta">${project.period}</p>
          <h3>${project.title[language]}</h3>
          <p>${project.description[language]}</p>
          <div class="project-tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <a class="project-link" href="${project.href}">
            ${label}
          </a>
        </article>
      `
    )
    .join("");
}

function renderContacts(language) {
  const grid = document.getElementById("contact-grid");

  grid.innerHTML = window.siteContent.contacts
    .map(
      (contact) => `
        <a class="contact-card" href="${contact.href}" target="_blank" rel="noreferrer">
          <span class="contact-label">${contact.label[language]}</span>
          <h3>${contact.value}</h3>
          <p>${contact.note[language]}</p>
        </a>
      `
    )
    .join("");
}

function renderProfileImage(language) {
  const image = document.getElementById("profile-image");
  image.src = window.siteContent.profileImage.src;
  image.alt = window.siteContent.profileImage.alt[language];
}

function updateLanguageButtons(language) {
  document.querySelectorAll(".lang-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
  });
}

function renderPage(language) {
  renderStaticText(language);
  renderHighlights(language);
  renderMarquee(language);
  renderProjects(language);
  renderContacts(language);
  renderProfileImage(language);
  updateLanguageButtons(language);
  document.getElementById("current-year").textContent = new Date().getFullYear();
  window.localStorage.setItem(STORAGE_KEY, language);
}

function bindLanguageSwitcher() {
  document.querySelectorAll(".lang-button").forEach((button) => {
    button.addEventListener("click", () => {
      renderPage(button.dataset.lang);
    });
  });
}

bindLanguageSwitcher();
renderPage(getInitialLanguage());
