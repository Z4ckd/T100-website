// assets/js/mobile-nav.js

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const body = document.body;

  if (!burger || !mobileMenu) return;

  // Toggle mobile menu
  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    burger.classList.toggle("active");
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      burger.classList.remove("active");
      body.style.overflow = "";
    });
  });

  // Close menu on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      mobileMenu.classList.remove("open");
      burger.classList.remove("active");
      body.style.overflow = "";
    }
  });

  // Close menu when clicking outside
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("open");
      burger.classList.remove("active");
      body.style.overflow = "";
    }
  });
});

// Smooth scroll for anchor links
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 60;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
});