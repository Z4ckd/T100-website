// assets/js/script.js

// (Optional) smooth scroll helper if you use it anywhere
window.scrollToId = function (id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", () => {
  const routeMap = [
    { pathPattern: /\/index\.html$/i, cleanPath: "/home" },
    { pathPattern: /\/careers\.html$/i, cleanPath: "/careers" },
    { pathPattern: /\/sellers\.html$/i, cleanPath: "/become-a-seller" }
  ];
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const matchedRoute = routeMap.find(
    (route) => route.cleanPath === currentPath || route.pathPattern.test(currentPath)
  );

  if (matchedRoute) {
    const normalizedUrl = `${matchedRoute.cleanPath}${window.location.hash || ""}`;

    if (`${window.location.pathname}${window.location.hash}` !== normalizedUrl) {
      window.history.replaceState({}, "", normalizedUrl);
    }
  }

  const cleanLinkMap = new Map([
    ["index.html", "/home"],
    ["index.html#shoppers-benefits", "/home#shoppers-benefits"],
    ["index.html#seller-benefits", "/home#seller-benefits"],
    ["index.html#how-it-works", "/home#how-it-works"],
    ["careers.html", "/careers"],
    ["sellers.html", "/become-a-seller"]
  ]);

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    const cleanHref = cleanLinkMap.get(href);

    if (cleanHref) {
      link.setAttribute("data-route-target", href);
      link.setAttribute("href", cleanHref);
    }
  });
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

  // Close when a link is clicked
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    });
  });

  // Close menu if resized up to desktop
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

      // Only handle anchor links (starting with #)
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Find the pill inside the section header
          const pill = targetSection.querySelector(".pill");
          const scrollTarget = pill || targetSection;

          // Scroll with offset for sticky navbar
          const navbarHeight = document.querySelector(".navbar").offsetHeight;
          const targetPosition = scrollTarget.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const homeSections = ["shoppers-benefits", "seller-benefits", "how-it-works"];
  const hasHomeSections = homeSections.every((id) => document.getElementById(id));

  if (!hasHomeSections) return;

  const homePath = "/home";
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const normalizeHomeUrl = () => {
    if (window.location.pathname !== homePath || window.location.hash) {
      window.history.replaceState({}, "", homePath);
    }
  };

  const scrollToSection = (sectionId) => {
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

  const sectionLinkSelector = [
    'a[href="#shoppers-benefits"]',
    'a[href="#seller-benefits"]',
    'a[href="#how-it-works"]',
    'a[href="index.html#shoppers-benefits"]',
    'a[href="index.html#seller-benefits"]',
    'a[href="index.html#how-it-works"]',
    'a[href="/home#shoppers-benefits"]',
    'a[href="/home#seller-benefits"]',
    'a[href="/home#how-it-works"]'
  ].join(", ");

  document.querySelectorAll(sectionLinkSelector).forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      const sectionId = href.split("#")[1];

      if (!sectionId) return;

      e.preventDefault();
      normalizeHomeUrl();
      scrollToSection(sectionId);
    });
  });

  if (currentPath === "/" || /\/index\.html$/i.test(currentPath) || currentPath === homePath) {
    const initialSection = window.location.hash.replace(/^#/, "");
    const hasInitialSection = homeSections.includes(initialSection);

    normalizeHomeUrl();

    if (hasInitialSection) {
      window.setTimeout(() => {
        scrollToSection(initialSection);
      }, 50);
    }
  }
});
