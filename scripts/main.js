const STORAGE_KEY = "portfolio-language";
const highlightedProjects = pickHighlightedProjects(window.siteContent.projects, 3);

function pickHighlightedProjects(projects, count) {
  const shuffled = [...projects];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

function getLinkAttributes(href) {
  return href && !href.startsWith("#") ? 'target="_blank" rel="noreferrer"' : "";
}

function getProjectHref(href) {
  return href === "#" ? "#projects" : href;
}

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

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = resolveText(element.dataset.i18n, language);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });
}

function renderMarquee(language) {
  const marquee = document.getElementById("hero-marquee");

  if (!marquee) {
    return;
  }

  const label = window.siteContent.translations[language].hero.marquee;
  const items = Array.from({ length: 10 }, () => `<span>${label}</span>`).join("");

  marquee.innerHTML = `<div class="marquee-track">${items}${items}</div>`;
}

function renderProjects(language) {
  const grid = document.getElementById("projects-grid");
  const label = window.siteContent.translations[language].projects.viewLabel;
  const fallbackImage = window.siteContent.profileImage;

  if (!grid) {
    return;
  }

  grid.innerHTML = window.siteContent.projects
    .map(
      (project) => {
        const projectHref = getProjectHref(project.href);

        return `
        <article class="project-card">
          <div class="project-media">
            <img
              src="${project.image?.src ?? fallbackImage.src}"
              alt="${project.image?.alt?.[language] ?? fallbackImage.alt[language]}"
              loading="lazy"
            />
          </div>
          <div class="project-body">
            <p class="project-meta">${project.period}</p>
            <h3>${project.title[language]}</h3>
            <p class="project-description">${project.description[language]}</p>
            <div class="project-tags">
              ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <a class="project-link" href="${projectHref}" ${getLinkAttributes(projectHref)}>
              ${label}
            </a>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

function renderHeroFiles(language) {
  const fileStack = document.getElementById("hero-files");

  if (!fileStack) {
    return;
  }

  const fileLabel = window.siteContent.translations[language].hero.fileLabel;
  const actionLabel = window.siteContent.translations[language].projects.viewLabel;
  const rotations = ["-3deg", "1deg", "4deg"];

  fileStack.innerHTML = highlightedProjects
    .map((project, index) => {
      const projectHref = getProjectHref(project.href);
      const tagSummary = project.tags.slice(0, 2).join(" / ");

      return `
        <a
          class="file-card"
          href="${projectHref}"
          ${getLinkAttributes(projectHref)}
          style="--file-index: ${index}; --file-rotation: ${rotations[index % rotations.length]};"
          aria-label="${project.title[language]} · ${actionLabel}"
        >
          <span class="file-card-kicker">${project.period} · ${fileLabel}</span>
          <strong class="file-card-title">${project.title[language]}</strong>
          <span class="file-card-meta">${tagSummary}</span>
          <span class="file-card-action">${actionLabel}</span>
        </a>
      `;
    })
    .join("");
}

function renderContacts(language) {
  const grid = document.getElementById("contact-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = window.siteContent.contacts
    .map(
      (contact) => `
        <a
          class="contact-link"
          href="${contact.href}"
          ${contact.type === "email" ? "" : 'target="_blank" rel="noreferrer"'}
          aria-label="${contact.label[language]}: ${contact.value}"
        >
          <span class="contact-icon" aria-hidden="true">${getContactIcon(contact.type)}</span>
          <span class="contact-name">${contact.label[language]}</span>
        </a>
      `
    )
    .join("");
}

function getContactIcon(type) {
  const icons = {
    email: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2"></rect>
        <path d="M4 7l8 6 8-6"></path>
      </svg>
    `,
    github: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.74.5 12.2c0 5.17 3.3 9.55 7.88 11.1.58.11.79-.26.79-.57 0-.28-.01-1.2-.02-2.18-3.2.71-3.88-1.39-3.88-1.39-.52-1.36-1.28-1.72-1.28-1.72-1.04-.73.08-.72.08-.72 1.15.08 1.75 1.2 1.75 1.2 1.02 1.8 2.68 1.28 3.34.98.1-.76.4-1.28.72-1.57-2.55-.3-5.23-1.3-5.23-5.8 0-1.28.45-2.33 1.18-3.15-.12-.3-.51-1.51.11-3.14 0 0 .97-.32 3.19 1.2a10.9 10.9 0 0 1 5.8 0c2.22-1.52 3.18-1.2 3.18-1.2.63 1.63.24 2.84.12 3.14.74.82 1.18 1.87 1.18 3.15 0 4.51-2.68 5.49-5.24 5.79.41.36.78 1.08.78 2.18 0 1.57-.02 2.83-.02 3.21 0 .31.2.68.8.57 4.57-1.56 7.86-5.94 7.86-11.1C23.5 5.74 18.35.5 12 .5Z"></path>
      </svg>
    `,
    linkedin: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.94 8.5H3.56V19.5H6.94V8.5Z"></path>
        <path d="M5.25 7.04C6.36 7.04 7.25 6.13 7.25 5.02C7.25 3.91 6.36 3 5.25 3C4.14 3 3.25 3.91 3.25 5.02C3.25 6.13 4.14 7.04 5.25 7.04Z"></path>
        <path d="M12.18 19.5H8.82V8.5H12.04V10H12.09C12.54 9.15 13.64 8.25 15.28 8.25C18.69 8.25 19.32 10.39 19.32 13.18V19.5H15.96V13.9C15.96 12.57 15.93 10.87 14.11 10.87C12.26 10.87 11.98 12.25 11.98 13.8V19.5H12.18Z"></path>
      </svg>
    `,
  };

  return icons[type] ?? icons.email;
}

function renderProfileImage(language) {
  const image = document.getElementById("profile-image");

  if (!image) {
    return;
  }

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
  renderMarquee(language);
  renderHeroFiles(language);
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
