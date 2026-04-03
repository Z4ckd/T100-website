// assets/js/script.js

// (Optional) smooth scroll helper if you use it anywhere
window.scrollToId = function (id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", () => {
  const homeSectionLinks = document.querySelectorAll("[data-home-section]");
  const termsTabLinks = document.querySelectorAll("[data-terms-tab]");
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const homeAliases = new Set(["/", "/home", "/index.html"]);

  const scrollToHomeSection = (sectionId) => {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    const pill = targetSection.querySelector(".pill");
    const scrollTarget = pill || targetSection;
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    const targetPosition =
      scrollTarget.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  };

  homeSectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.getAttribute("data-home-section");

      if (!sectionId) return;

      sessionStorage.setItem("homeSectionTarget", sectionId);
    });
  });

  termsTabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tabId = link.getAttribute("data-terms-tab");

      if (!tabId) return;

      sessionStorage.setItem("termsTabTarget", tabId);
    });
  });

  if (!homeAliases.has(currentPath)) return;

  const hashSection = window.location.hash.replace(/^#/, "");
  const storedSection = sessionStorage.getItem("homeSectionTarget");
  const targetSection = hashSection || storedSection;

  if (window.location.pathname !== "/home" || window.location.hash) {
    window.history.replaceState({}, "", "/home");
  }

  if (!targetSection) return;

  sessionStorage.removeItem("homeSectionTarget");

  window.setTimeout(() => {
    scrollToHomeSection(targetSection);
  }, 50);
});

// Mobile nav toggle (runs after DOM is ready)
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");

  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-hidden", String(!isOpen));
  });
});

// Smooth scroll for nav links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const pill = targetSection.querySelector(".pill");
          const scrollTarget = pill || targetSection;
          const navbarHeight = document.querySelector(".navbar").offsetHeight;
          const targetPosition =
            scrollTarget.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
});
