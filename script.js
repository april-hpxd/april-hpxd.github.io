/* ============================================================
   Altynai's Chaotic Corner — interactions
   Kept lightweight & motion-safe. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- achievement toast (reused by easter eggs) ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function popAchievement(title, body) {
    if (!toast) return;
    toast.hidden = false;
    toast.innerHTML =
      '<span class="t-title">🏅 ' + title + '</span>' +
      '<span class="t-body">' + body + "</span>";
    // force reflow so the transition retriggers
    void toast.offsetWidth;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
  }

  /* ---------- custom cursor (desktop only) ---------- */
  const cursor = document.querySelector(".cursor");
  if (cursor && !isTouch && !reduceMotion) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.top = e.clientY + "px";
      cursor.style.left = e.clientX + "px";
    });
    // grow the ring over interactive things
    document.querySelectorAll("a, button, .card, .gallery-img, .project-card, .meme-slot")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover-active"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hover-active"));
      });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------- scroll reveal for sections ---------- */
  const sections = document.querySelectorAll("section");
  if (reduceMotion) {
    sections.forEach((s) => s.classList.add("visible"));
  } else {
    sections.forEach((s) => s.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- floating doodles (cozy decorations) ---------- */
  const doodleField = document.querySelector(".doodle-field");
  if (doodleField && !reduceMotion) {
    // only things that match the vibe: sparkles, frog, duck, coffee, books, plants...
    const doodles = ["✦", "✧", "🐸", "🦆", "☕", "📚", "⭐", "🌱", "🍄", "✏️"];
    const layout = [
      { x: 4,  y: 12, s: 20 }, { x: 92, y: 18, s: 24 }, { x: 12, y: 78, s: 18 },
      { x: 84, y: 84, s: 22 }, { x: 48, y: 6,  s: 16 }, { x: 68, y: 46, s: 20 },
      { x: 24, y: 40, s: 18 }, { x: 96, y: 60, s: 16 }, { x: 40, y: 92, s: 20 },
      { x: 2,  y: 50, s: 22 },
    ];
    layout.forEach((pos, i) => {
      const d = document.createElement("span");
      d.className = "doodle";
      d.textContent = doodles[i % doodles.length];
      d.style.left = pos.x + "%";
      d.style.top = pos.y + "%";
      d.style.setProperty("--size", pos.s + "px");
      d.style.setProperty("--dur", 6 + (i % 5) + "s");
      d.style.setProperty("--delay", (i * 0.4) + "s");
      d.style.setProperty("--rot", (i % 2 ? -8 : 8) + "deg");
      doodleField.appendChild(d);
    });
  }

  /* ---------- image modal ---------- */
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");
  const closeBtn = modal ? modal.querySelector(".modal-close") : null;

  function openModal(src, alt) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || "Enlarged view";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-img").forEach((img) => {
    img.addEventListener("click", () => openModal(img.dataset.src || img.src, img.alt));
  });
  if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal || e.target === closeBtn) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- easter egg: Konami code ---------- */
  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  document.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = (key === konami[kIdx]) ? kIdx + 1 : (key === konami[0] ? 1 : 0);
    if (kIdx === konami.length) {
      kIdx = 0;
      triggerKonami();
    }
  });

  function triggerKonami() {
    popAchievement("SECRET FOUND", "You speak fluent Konami. Raining cats & frogs now ✦");
    if (reduceMotion) return;
    const emojis = ["🐱", "🐸", "✦", "⭐", "🦆", "☕", "🍄"];
    for (let i = 0; i < 36; i++) {
      const s = document.createElement("span");
      s.textContent = emojis[i % emojis.length];
      s.style.cssText =
        "position:fixed;top:-40px;z-index:1500;pointer-events:none;font-size:" +
        (18 + Math.floor((i % 4) * 6)) + "px;left:" + ((i * 2.7) % 100) + "vw;";
      document.body.appendChild(s);
      const fall = s.animate(
        [
          { transform: "translateY(-40px) rotate(0deg)", opacity: 1 },
          { transform: "translateY(105vh) rotate(540deg)", opacity: 0.9 },
        ],
        { duration: 2600 + (i % 6) * 350, easing: "cubic-bezier(.3,.1,.4,1)" }
      );
      fall.onfinish = () => s.remove();
    }
  }

  /* ---------- easter egg: click the side sprite ---------- */
  const sideSprite = document.querySelector(".side-profile");
  if (sideSprite) {
    sideSprite.style.pointerEvents = "auto";
    sideSprite.style.cursor = "pointer";
    let clicks = 0;
    sideSprite.addEventListener("click", () => {
      clicks++;
      const lines = [
        "hi! you found me 👀",
        "shouldn't you be studying?",
        "ok now you're just clicking me",
        "achievement pending...",
      ];
      if (clicks === 4) {
        popAchievement("PERSISTENT", "You clicked the tiny me 4 times. Respect. 🫡");
      } else {
        popAchievement("psst", lines[(clicks - 1) % lines.length]);
      }
    });
  }

  /* ---------- console easter egg ---------- */
  const style = "color:#e0a84e;font-size:13px;font-family:monospace;";
  console.log("%c✦ oh hey, a fellow dev in the console ✦", style);
  console.log("%cPowered by caffeine and Stack Overflow. Try the Konami code ↑↑↓↓←→←→BA :)", "color:#6b4f33;font-family:monospace;");
})();
