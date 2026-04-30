// assets/js/i18n.js

(function () {
  const STORAGE_KEY = "tenh100-language";
  const supportedLanguages = new Set(["en", "km"]);

  const translations = {
    km: {
      "For Shoppers": "សម្រាប់អ្នកទិញ",
      "For Sellers": "សម្រាប់អ្នកលក់",
      "For Sellers Alike": "សម្រាប់អ្នកលក់",
      "How It Works": "របៀបដំណើរការ",
      "Careers": "ការងារ",
      "Become a Seller": "ក្លាយជាអ្នកលក់",
      "Become a Seller →": "ក្លាយជាអ្នកលក់ →",
      "Become a Seller &rarr;": "ក្លាយជាអ្នកលក់ →",
      "Download App": "ទាញយកកម្មវិធី",
      "A Marketplace In Your Pocket": "ផ្សារទំនើបក្នុងដៃអ្នក",
      "Search Local Shop Local": "ស្វែងរកក្នុងស្រុក ទិញក្នុងស្រុក",
      "With": "ជាមួយ",
      "Search Local Shop Local\n          With TENH100": "ស្វែងរកក្នុងស្រុក ទិញក្នុងស្រុក\n          ជាមួយ TENH100",
      "Discover thousands of products from trusted local sellers across Cambodia, all gathered in your pocket.": "ស្វែងរកផលិតផលរាប់ពាន់ពីអ្នកលក់ក្នុងស្រុកដែលគួរឱ្យទុកចិត្តទូទាំងកម្ពុជា ទាំងអស់ស្ថិតក្នុងដៃអ្នក។",
      "Entrusted Partners": "ដៃគូដែលគួរឱ្យទុកចិត្ត",
      "The TENH100 Promise": "ការសន្យារបស់ TENH100",
      "Enjoy thoughtfully designed features built to address the everyday challenges of shopping in Cambodia.": "រីករាយជាមួយមុខងារដែលបានរចនាយ៉ាងយកចិត្តទុកដាក់ ដើម្បីដោះស្រាយបញ្ហាប្រចាំថ្ងៃនៃការទិញទំនិញនៅកម្ពុជា។",
      "Easy Searching": "ស្វែងរកងាយស្រួល",
      "Search through thousands of products from your favorite Sellers with an intuitive interface.": "ស្វែងរកផលិតផលរាប់ពាន់ពីអ្នកលក់ដែលអ្នកចូលចិត្ត ជាមួយផ្ទៃប្រើប្រាស់ងាយយល់។",
      "Fast Delivery": "ដឹកជញ្ជូនរហ័ស",
      "Get your orders delivered with our network of reliable logistics partners.": "ទទួលបានការដឹកជញ្ជូនការបញ្ជាទិញរបស់អ្នកតាមបណ្តាញដៃគូដឹកជញ្ជូនដែលគួរឱ្យទុកចិត្ត។",
      "Secure Payments": "ការទូទាត់មានសុវត្ថិភាព",
      "Pay with confidence using secure systems that protect your payment information.": "ទូទាត់ដោយជឿជាក់តាមប្រព័ន្ធសុវត្ថិភាពដែលការពារព័ត៌មានទូទាត់របស់អ្នក។",
      "Verified Sellers": "អ្នកលក់បានផ្ទៀងផ្ទាត់",
      "Shop confidently with sellers carefully reviewed to ensure reliable products and trustworthy listings.": "ទិញដោយជឿជាក់ជាមួយអ្នកលក់ដែលបានពិនិត្យយ៉ាងម៉ត់ចត់ ដើម្បីធានាផលិតផល និងបញ្ជីទំនិញដែលគួរឱ្យទុកចិត្ត។",
      "Authentic Reviews": "មតិយោបល់ពិតប្រាកដ",
      "Read genuine reviews from real customers to help you make confident purchase decisions.": "អានមតិយោបល់ពិតពីអតិថិជនពិត ដើម្បីជួយឱ្យអ្នកសម្រេចចិត្តទិញដោយជឿជាក់។",
      "Live Support": "ជំនួយផ្ទាល់",
      "Our customer support team is always available to answer your questions and resolve any issues.": "ក្រុមជំនួយអតិថិជនរបស់យើងតែងតែមានសម្រាប់ឆ្លើយសំណួរ និងដោះស្រាយបញ្ហារបស់អ្នក។",
      "Start Shopping Now": "ចាប់ផ្តើមទិញឥឡូវនេះ",
      "Download our app • Sign Up • Shop securely anytime": "ទាញយកកម្មវិធី • ចុះឈ្មោះ • ទិញដោយសុវត្ថិភាពគ្រប់ពេល",
      "Why Partner With Us?": "ហេតុអ្វីគួរចាប់ដៃគូជាមួយយើង?",
      "Join our thriving marketplace and take your business to the next level!": "ចូលរួមជាមួយផ្សារដែលកំពុងរីកចម្រើនរបស់យើង ហើយនាំអាជីវកម្មអ្នកទៅកម្រិតបន្ទាប់!",
      "Expand Your Reach": "ពង្រីកការឈានដល់របស់អ្នក",
      "Connect with millions of active shoppers looking for products like yours.": "ភ្ជាប់ជាមួយអ្នកទិញសកម្មជាច្រើនដែលកំពុងស្វែងរកផលិតផលដូចរបស់អ្នក។",
      "Ready to Start Selling?": "ត្រៀមចាប់ផ្តើមលក់ហើយឬនៅ?",
      "Fill out the form and our team will contact you within 24 hours to complete your onboarding.": "បំពេញសំណុំបែបបទ ហើយក្រុមការងារយើងនឹងទាក់ទងអ្នកក្នុងរយៈពេល ២៤ ម៉ោង ដើម្បីបញ្ចប់ការចូលរួម។",
      "Careers": "ការងារ",
      "There are no open roles listed right now. Check back again as TENH100 continues building the team.": "បច្ចុប្បន្នមិនមានមុខតំណែងបើកទទួលទេ។ សូមត្រឡប់មកពិនិត្យម្តងទៀត នៅពេល TENH100 បន្តពង្រីកក្រុម។",
      "Apply directly with your CV": "ដាក់ពាក្យដោយផ្ញើ CV របស់អ្នក",
      "Open Positions": "មុខតំណែងបើកទទួល",
      "No roles listed right now": "បច្ចុប្បន្នមិនមានមុខតំណែងទេ",
      "Website Application": "ការដាក់ពាក្យតាមគេហទំព័រ",
      "Apply directly through TENH100": "ដាក់ពាក្យផ្ទាល់តាម TENH100",
      "Candidate Registration": "ចុះឈ្មោះបេក្ខជន",
      "Submit Candidate Profile →": "ដាក់ស្នើប្រវត្តិបេក្ខជន →",
      "Terms & Agreements": "លក្ខខណ្ឌ និងកិច្ចព្រមព្រៀង",
      "Please read these terms carefully before using TENH100.": "សូមអានលក្ខខណ្ឌទាំងនេះដោយប្រុងប្រយ័ត្ន មុនប្រើប្រាស់ TENH100។",
      "Terms of Service": "លក្ខខណ្ឌសេវាកម្ម",
      "Seller Agreement": "កិច្ចព្រមព្រៀងអ្នកលក់",
      "Customer Purchase Policy": "គោលការណ៍ទិញរបស់អតិថិជន",
      "Last Updated: March 15, 2026": "បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ 15 មីនា 2026"
    }
  };

  const originalText = new WeakMap();
  const originalPlaceholder = new WeakMap();

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function getLanguage() {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);
    return supportedLanguages.has(storedLanguage) ? storedLanguage : "en";
  }

  function translateValue(value, language) {
    if (language === "en") return value;

    const languageMap = translations[language] || {};
    const direct = languageMap[value.trim()];
    if (direct) return direct;

    const normalized = normalizeText(value);
    return languageMap[normalized] || value;
  }

  function updateLanguageControls(language) {
    document.querySelectorAll("[data-language-select]").forEach((select) => {
      select.value = language;
      const switcher = select.closest(".language-switcher");
      const icon = switcher?.querySelector(".language-switcher-icon");
      if (icon) icon.textContent = language === "km" ? "ខ្មែរ" : "EN";
    });
  }

  function translateTextNodes(language) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript, option")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const source = originalText.get(node);
      node.nodeValue = translateValue(source, language);
    });
  }

  function translatePlaceholders(language) {
    document.querySelectorAll("[placeholder]").forEach((element) => {
      if (!originalPlaceholder.has(element)) {
        originalPlaceholder.set(element, element.getAttribute("placeholder"));
      }

      const source = originalPlaceholder.get(element);
      element.setAttribute("placeholder", translateValue(source, language));
    });
  }

  function applyLanguage(language) {
    document.documentElement.lang = language === "km" ? "km" : "en";
    document.body.classList.toggle("is-khmer", language === "km");
    updateLanguageControls(language);
    translateTextNodes(language);
    translatePlaceholders(language);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(getLanguage());

    document.querySelectorAll("[data-language-select]").forEach((select) => {
      select.addEventListener("change", (event) => {
        const language = event.target.value;
        if (!supportedLanguages.has(language)) return;
        localStorage.setItem(STORAGE_KEY, language);
        applyLanguage(language);
      });
    });
  });
})();
