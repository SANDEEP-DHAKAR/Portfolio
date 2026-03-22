(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;
  var docEl = document.documentElement;

  if (reduceMotion) {
    body.classList.add("reduce-fx");
  } else {
    docEl.classList.add("js-reveal");
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Nav mobile */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Typing hero */
  var typedTarget = document.getElementById("typed-output");
  var typedCaret = document.getElementById("typed-caret");
  var fullText = "Hi, I'm Sandeep - MERN Stack Developer";
  var ti = 0;

  function typeTick() {
    if (!typedTarget) return;
    if (ti <= fullText.length) {
      typedTarget.textContent = fullText.slice(0, ti);
      ti++;
      var delay = fullText.charAt(ti - 1) === " " ? 45 : reduceMotion ? 0 : 28 + Math.random() * 40;
      setTimeout(typeTick, delay);
    } else if (typedCaret) {
      typedCaret.style.display = "inline-block";
    }
  }

  if (typedTarget && !reduceMotion) {
    setTimeout(typeTick, 400);
  } else if (typedTarget) {
    typedTarget.textContent = fullText;
  }

  /* Cursor glow */
  var glow = document.querySelector(".cursor-glow");
  var glowRaf = null;
  var gx = 0;
  var gy = 0;
  var gxt = 0;
  var gyt = 0;

  function moveGlow() {
    if (!glow || reduceMotion) return;
    gxt += (gx - gxt) * 0.12;
    gyt += (gy - gyt) * 0.12;
    glow.style.left = gxt + "px";
    glow.style.top = gyt + "px";
    glowRaf = requestAnimationFrame(moveGlow);
  }

  if (glow && !reduceMotion) {
    window.addEventListener(
      "pointermove",
      function (e) {
        gx = e.clientX;
        gy = e.clientY;
      },
      { passive: true }
    );
    moveGlow();
  }

  /* Trail canvas */
  var trailCanvas = document.getElementById("trail-canvas");
  var trailCtx = trailCanvas && trailCanvas.getContext ? trailCanvas.getContext("2d") : null;
  var trailPoints = [];
  var maxTrail = 48;
  var lastTrailPush = 0;
  var trailThrottleMs = 22;

  function resizeTrail() {
    if (!trailCanvas) return;
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }

  function pushTrail(x, y) {
    var now = performance.now();
    if (now - lastTrailPush < trailThrottleMs) return;
    lastTrailPush = now;
    trailPoints.push({ x: x, y: y, a: 0.55, r: 3 + Math.random() * 2 });
    if (trailPoints.length > maxTrail) trailPoints.shift();
  }

  function drawTrail() {
    if (!trailCtx || !trailCanvas) return;
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    for (var i = 0; i < trailPoints.length; i++) {
      var p = trailPoints[i];
      p.a *= 0.92;
      p.r *= 0.985;
      var g = trailCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, "rgba(0, 245, 255, " + p.a * 0.9 + ")");
      g.addColorStop(0.4, "rgba(178, 75, 243, " + p.a * 0.35 + ")");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      trailCtx.fillStyle = g;
      trailCtx.beginPath();
      trailCtx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      trailCtx.fill();
    }
    trailPoints = trailPoints.filter(function (pt) {
      return pt.a > 0.02;
    });
    requestAnimationFrame(drawTrail);
  }

  if (trailCanvas && trailCtx && !reduceMotion) {
    resizeTrail();
    window.addEventListener("resize", resizeTrail, { passive: true });
    window.addEventListener(
      "pointermove",
      function (e) {
        pushTrail(e.clientX, e.clientY);
      },
      { passive: true }
    );
    requestAnimationFrame(drawTrail);
  }

  /* Matrix rain (hero) */
  var matrixEl = document.getElementById("matrix-canvas");
  var mctx = matrixEl && matrixEl.getContext ? matrixEl.getContext("2d") : null;
  var matrixDrops = [];
  var matrixW = 0;
  var matrixH = 0;
  var matrixFont = 14;
  var matrixRaf = null;
  var matrixRunning = false;
  var matrixChars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01";

  function stopMatrix() {
    matrixRunning = false;
    if (matrixRaf) {
      cancelAnimationFrame(matrixRaf);
      matrixRaf = null;
    }
  }

  function matrixFrame() {
    if (!matrixRunning || !matrixEl || !mctx) return;
    mctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    mctx.fillRect(0, 0, matrixW, matrixH);
    for (var i = 0; i < matrixDrops.length; i++) {
      var ch = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      var x = i * matrixFont;
      var y = matrixDrops[i] * matrixFont;
      var isHead = Math.random() > 0.96;
      mctx.fillStyle = isHead ? "#00ff88" : "rgba(0, 245, 255, 0.55)";
      mctx.shadowColor = isHead ? "#00ff88" : "#00f5ff";
      mctx.shadowBlur = isHead ? 12 : 6;
      mctx.fillText(ch, x, y);
      mctx.shadowBlur = 0;
      if (y > matrixH && Math.random() > 0.975) matrixDrops[i] = 0;
      matrixDrops[i] += 0.55 + Math.random() * 0.35;
    }
    matrixRaf = requestAnimationFrame(matrixFrame);
  }

  function initMatrix() {
    if (!matrixEl || !mctx || reduceMotion) return;
    stopMatrix();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    matrixW = matrixEl.clientWidth;
    matrixH = matrixEl.clientHeight;
    matrixEl.width = matrixW * dpr;
    matrixEl.height = matrixH * dpr;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    matrixFont = matrixW < 600 ? 11 : 14;
    var columns = Math.ceil(matrixW / matrixFont);
    matrixDrops = [];
    for (var c = 0; c < columns; c++) {
      matrixDrops[c] = Math.random() * -100;
    }
    mctx.font = "600 " + matrixFont + "px JetBrains Mono, monospace";
    matrixRunning = true;
    matrixRaf = requestAnimationFrame(matrixFrame);
  }

  if (matrixEl && !reduceMotion) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initMatrix);
    } else {
      window.addEventListener("load", initMatrix);
    }
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(matrixEl._rt);
        matrixEl._rt = setTimeout(initMatrix, 180);
      },
      { passive: true }
    );
  }

  /* Project preview: show neon fallback if remote screenshot fails */
  document.querySelectorAll("img.project-preview").forEach(function (img) {
    img.addEventListener("error", function () {
      this.classList.add("is-broken");
      var wrap = this.closest(".project-thumb");
      if (wrap) {
        var fb = wrap.querySelector(".thumb-fallback");
        if (fb) fb.classList.add("is-visible");
      }
    });
  });

  /* Tilt cards */
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    if (reduceMotion) return;
    var max = 12;
    card.addEventListener(
      "pointermove",
      function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        var rx = -py * max;
        var ry = px * max;
        card.style.transform =
          "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateZ(0)";
      },
      { passive: true }
    );
    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  });

  /* Contact form → mailto */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("msg-name");
      var email = document.getElementById("msg-email");
      var msg = document.getElementById("msg-text");
      if (!name || !email || !msg) return;
      var subject = encodeURIComponent("Portfolio contact: " + name.value.trim());
      var body = encodeURIComponent(
        "From: " + name.value.trim() + "\nEmail: " + email.value.trim() + "\n\n" + msg.value.trim()
      );
      window.location.href =
        "mailto:sandeepdhakar285@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  /* GSAP: page load + scroll */
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
    docEl.classList.remove("js-reveal");
    document.querySelectorAll(".skill-fill[data-percent]").forEach(function (bar) {
      var pct = bar.getAttribute("data-percent");
      if (pct) bar.style.width = pct + "%";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(body, { opacity: 0 });
  body.classList.remove("is-loading");

  var loadTl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: function () {
      body.classList.add("is-loaded");
    },
  });

  loadTl.to(body, {
    opacity: 1,
    duration: reduceMotion ? 0.01 : 0.85,
  });

  if (!reduceMotion) {
    loadTl.from(
      ".hero-inner > *",
      {
        opacity: 0,
        y: 28,
        stagger: 0.12,
        duration: 0.7,
      },
      "-=0.45"
    );
  }

  document.querySelectorAll(".reveal").forEach(function (el) {
    if (reduceMotion) {
      gsap.set(el, { clearProps: "opacity,transform" });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  document.querySelectorAll(".skill-fill[data-percent]").forEach(function (bar) {
    var pct = bar.getAttribute("data-percent");
    var row = bar.closest(".skill");
    if (!row || !pct) return;

    if (reduceMotion) {
      bar.style.width = pct + "%";
      return;
    }

    gsap.fromTo(
      bar,
      { width: "0%" },
      {
        width: pct + "%",
        duration: 1.25,
        ease: "power2.out",
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  ScrollTrigger.refresh();
})();
