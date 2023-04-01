import smoothscroll from "smoothscroll-polyfill";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ClipboardJS from "clipboard";
import "lite-youtube-embed";
import PhotoSwipeLightbox from "photoswipe/lightbox";

import "map.js";

import "index.scss";

smoothscroll.polyfill();

// Import all javascript files from src/_components
const componentsContext = require.context("bridgetownComponents", true, /.js$/);
componentsContext.keys().forEach(componentsContext);

console.info("Bridgetown is loaded!");

window.addEventListener(
  "load",
  () => {
    setClickListeners();
    setScrollListener();
    setIntersectionObserver();
    linkDateBlocker();
    discountCodeApplicator();
    clipboardHandlers();
    initPhotoGallery();
  },
  false
);

const item = document.querySelector(".animation__item");
const logo = document.querySelector(".animation__logo");
const headerSmallLogo = document.querySelector(".header__logo");
const date = document.querySelector(".animation__date");
const animation = document.querySelector(".animation");
const animationContainer = document.querySelector(".animation-container");
const hidden = document.querySelector(".animation__item-hidden");
const links = document.querySelectorAll(".header__link");
const body = document.querySelector("body");

document.addEventListener("DOMContentLoaded", function () {
  const animationPlayed = sessionStorage.getItem("animationPlayed");
  body.style.background = "#d9d9d9";
  if (!animationPlayed && document.getElementById("home-content")) {
    body.style.background = "#000";
    document.getElementById("animation").style.display = "block";
    document.getElementById("home-content").style.display = "none";
    sessionStorage.setItem("animationPlayed", true);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const animationPlayed = sessionStorage.getItem("animationPlayed");
  if (!animationPlayed && document.getElementById("home-content")) {
    body.style.background = "#000";
    document.getElementById("animation").style.display = "block";
    document.getElementById("home-content").style.display = "none";
    sessionStorage.setItem("animationPlayed", true);
  }
});

animation.addEventListener("animationend", () => {
  document.getElementById("home-content").style.display = "flex";
  setTimeout(() => {
    document.getElementById("home-content").style.animation = "visible 2s";
  }, 500);
});

item.addEventListener("animationstart", () => {
  links.forEach((link) => {
    link.style.color = "#d9d9d9";
  });
  setTimeout(() => {
    logo.style.opacity = "1";
    logo.style.animation = "moveLogo 2.5s ease-in-out";
  }, 800);
});

item.addEventListener("animationend", () => {
  item.style.animation = "none";
});

logo.addEventListener("animationend", () => {
  date.style.opacity = "1";

  setTimeout(() => {
    document.body.style.transition = "background-color 2.5s ease";
    document.body.style.backgroundColor = "#d9d9d9";

    hidden.style.animation = "color-change";
    logo.style.animation = "none";
    animation.style.opacity = "0";

    links.forEach((link) => {
      link.style.animation = "color-change 1.5s ease-in-out forwards";
    });
    setTimeout(() => {
      headerSmallLogo.style.opacity = "1";
      headerSmallLogo.style.transition = "opacity 0.5s linear";
      animation.style.display = "none";
      animationContainer.style.display = "none";
    }, 500);
  }, 500);
});

animation.addEventListener("transitionend", (event) => {
  if (event.propertyName === "transform") {
    headerSmallLogo.style.display = "block";
  }
});

function loadPage(url) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, "text/html");
      const newContent = newDocument.querySelector("#content").innerHTML;
      document.querySelector("#content").innerHTML = newContent;
    });
}

document.querySelectorAll("#nav_link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    history.pushState({}, "", link.href);
    loadPage(link.href);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

const initPhotoGallery = () => {
  const gallery = document.getElementById("gallery");
  if (gallery) {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  }
};

const setScrollListener = () => {
  const header = document.getElementById("header");
  const heroImage = document.getElementById("hero-image");

  if (header && window.scrollY > 100) {
    header.classList.remove("header--not-scrolled");
  }

  if (heroImage && window.scrollY < 1600) {
    heroImage.style.cssText = "transform: translate3d(0, " + (window.scrollY * 0.3).toFixed(0) + "px, 0);";
  }

  window.addEventListener("scroll", (e) => {
    if (header && window.scrollY > 100) {
      header.classList.remove("header--not-scrolled");
    } else {
      header.classList.add("header--not-scrolled");
    }
    if (heroImage && window.scrollY < 1600) {
      heroImage.style.cssText = "transform: translate3d(0, " + (window.scrollY * 0.3).toFixed(0) + "px, 0);";
    }
  });
};

const setClickListeners = () => {
  const mobileToggle = document.getElementById("mobile-toggle");
  const header = document.getElementById("header");
  const continueButton = document.querySelector("[data-continue-button]");
  if (mobileToggle && header) {
    mobileToggle.addEventListener("click", () => {
      header.classList.toggle("header--mobile-toggled");
    });
  }

  if (continueButton) {
    continueButton.addEventListener("click", (e) => {
      continueButton.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }

  const links = document.getElementsByTagName("a");
  for (let link of links) {
    if (link.href) {
      const url = new URL(link.href);
      if (url.hostname === window.location.hostname && url.pathname === window.location.pathname && url.hash) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById(url.hash.substring(1));
          if (target) {
            header.classList.remove("header--mobile-toggled");
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            history.replaceState({}, "", url.hash);
          }
        });
      }
    }
  }
};

const setIntersectionObserver = () => {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(observerCallback, options);

  document.querySelectorAll(".section__heading").forEach((section) => {
    observer.observe(section);
  });
};

const observerCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("section__heading--active");
    }
  });
};

const linkDateBlocker = () => {
  const links = document.querySelectorAll("a[data-datetime]");
  for (let link of links) {
    const date = new Date(link.dataset.datetime);
    if (date && !isNaN(date) && date >= Date.now()) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const now = Date.now();
        if (date <= now) {
          window.location.href = link.href;
        } else {
          console.log(link.dataset);
          if (!link.dataset.blocked) {
            link.dataset.blocked = true;
            const span = link.querySelector("span");
            const originalText = span.innerText;
            const distance = formatDistanceToNow(date, { addSuffix: true });
            span.innerText = `Available ${distance}`;
            setTimeout(() => {
              delete link.dataset.blocked;
              span.innerText = originalText;
            }, 5000);
          }
        }
      });
    }
  }
};

const discountCodeApplicator = () => {
  const listing = document.querySelector("[data-ticket-listing]");
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (listing && params.code) {
    let code = params.code;
    console.table({ code });
    const codeSpan = document.createElement("span");
    codeSpan.classList.add("tickets__listing__discount--code");
    codeSpan.innerText = code;

    const discountDiv = document.createElement("div");
    discountDiv.classList.add("tickets__listing__discount");
    discountDiv.innerHTML = `👍 Discount code ${codeSpan.outerHTML} will be applied at checkout to eligible tickets.`;

    listing.parentNode.insertBefore(discountDiv, listing);
    // listing.insertAdjacentElement("afterend", discountDiv.cloneNode(true))

    const links = listing.querySelectorAll("a[href]");

    for (let link of links) {
      const url = new URL(link.href);
      if (url.hostname === "ti.to") {
        const path = url.pathname.split("/");
        url.pathname = path.concat(["discount", code]).join("/");
        link.href = url.toString();
      }
    }
  }
};

const clipboardHandlers = () => {
  const clipboard = new ClipboardJS("button[data-clipboard-target]");
  clipboard.on("success", function ({ trigger }) {
    const oldLabel = trigger.innerText;
    trigger.innerText = "Copied!";
    setTimeout(() => {
      trigger.innerText = oldLabel;
    }, 3000);
  });
};
