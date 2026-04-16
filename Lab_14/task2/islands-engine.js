// islands-engine.js

// 1. Define Island Behaviors using isolated closures
const IslandRegistry = {
  counter: (container) => {
    console.log("[Island Engine] Initializing Counter Island", container);

    let count = 0;

    const display = container.querySelector(".count-display");
    const btnInc = container.querySelector(".btn-increase");
    const btnDec = container.querySelector(".btn-decrease");

    if (!display || !btnInc || !btnDec) {
      console.error("[Island Engine] Counter island missing required DOM nodes.");
      return;
    }

    btnInc.addEventListener("click", () => {
      count++;
      display.textContent = count;
    });

    btnDec.addEventListener("click", () => {
      if (count > 0) {
        count--;
      }
      display.textContent = count;
    });

    // state lives only inside this island closure
  },

  "color-picker": (container) => {
    console.log("[Island Engine] Initializing Color Picker Island", container);

    const preview = container.querySelector(".preview-box");
    const buttons = container.querySelectorAll("button[data-color]");

    if (!preview || buttons.length === 0) {
      console.error("[Island Engine] Color picker island missing required DOM nodes.");
      return;
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const hex = e.target.getAttribute("data-color");
        preview.style.backgroundColor = hex;
      });
    });

    // no shared state with other islands
  }
};

// 2. Discover and Mount with lazy hydration
document.addEventListener("DOMContentLoaded", () => {
  const islands = document.querySelectorAll("[data-island-type]");

  if (!("IntersectionObserver" in window)) {
    // fallback: hydrate immediately if observer unavailable
    islands.forEach((island) => {
      const type = island.getAttribute("data-island-type");
      if (IslandRegistry[type]) {
        IslandRegistry[type](island);
      }
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const type = entry.target.getAttribute("data-island-type");

          if (IslandRegistry[type]) {
            IslandRegistry[type](entry.target);

            // stop observing once hydrated
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  islands.forEach((island) => observer.observe(island));
});