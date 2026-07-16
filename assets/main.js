/* The Brody Group. Site behavior. Progressive enhancement, no dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector(".hamburger");
  var drawer = document.getElementById("drawer");
  if (burger && drawer) {
    var toggle = function (open) {
      var next = open === undefined ? burger.getAttribute("aria-expanded") !== "true" : open;
      burger.setAttribute("aria-expanded", String(next));
      drawer.classList.toggle("open", next);
      document.body.style.overflow = next ? "hidden" : "";
    };
    burger.addEventListener("click", function () { toggle(); });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { toggle(false); }
    });
  }

  /* ---------- bottom quote bar on scroll (mobile) ---------- */
  var quotebar = document.querySelector(".quotebar");
  if (quotebar) {
    var onScroll = function () {
      if (window.scrollY > 560) { quotebar.classList.add("show"); }
      else { quotebar.classList.remove("show"); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- work grid filters (v1 workitem + v2 rrow) ---------- */
  var pills = document.querySelectorAll(".pill[data-filter], .filters-text button[data-filter]");
  var items = document.querySelectorAll(".workitem[data-cat], .rrow[data-cat]");
  if (pills.length && items.length) {
    var groups = document.querySelectorAll(".filter-group");
    function applyFilter(f) {
      items.forEach(function (item) {
        var match = f === "all" || item.getAttribute("data-cat") === f;
        item.hidden = !match;
      });
      groups.forEach(function (g) {
        var visible = g.querySelectorAll("[data-cat]:not([hidden])").length;
        g.hidden = visible === 0;
      });
    }
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var f = pill.getAttribute("data-filter");
        pills.forEach(function (p) { p.setAttribute("aria-pressed", String(p === pill)); });
        applyFilter(f);
      });
    });
  }

  /* ---------- contact form ----------
     Submits to /api/contact (Cloudflare Pages Function -> Email Service).
     Falls back to mailto: if the endpoint is unavailable or errors, so the
     lead is never lost. */
  var form = document.getElementById("quote-form");
  if (form) {
    var success = document.getElementById("form-success");
    var endpoint = form.getAttribute("data-endpoint") || "/api/contact";

    var readValues = function () {
      var data = new FormData(form);
      var pick = function (k) { return (data.get(k) || "").toString(); };
      return {
        company_website: pick("company_website"),
        name: pick("name").trim(),
        email: pick("email").trim(),
        phone: pick("phone").trim(),
        service: pick("service"),
        budget: pick("budget"),
        message: pick("message").trim()
      };
    };

    var showSuccess = function () {
      if (!success) return;
      form.hidden = true;
      success.classList.add("show");
      success.setAttribute("tabindex", "-1");
      success.focus();
    };

    var mailtoFallback = function (v) {
      var to = form.getAttribute("data-mailto") || "judahbrody@gmail.com";
      var subject = "New project inquiry: " + (v.service || "General");
      var body =
        "Name: " + v.name + "\n" +
        "Email: " + v.email + "\n" +
        "Phone: " + v.phone + "\n" +
        "Service: " + v.service + "\n" +
        "Budget: " + v.budget + "\n\n" +
        v.message;
      var mailto = "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = readValues();
      /* honeypot: if filled, silently drop (never touch endpoint or mail app) */
      if (v.company_website !== "") { return; }

      var submitBtn = form.querySelector('.form__submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      var done = false;
      var finish = function (ok, fromServer) {
        if (done) return;
        done = true;
        if (ok) {
          showSuccess();
        } else {
          /* Endpoint unreachable or errored: open mail client as backup. */
          showSuccess();
          window.setTimeout(function () { mailtoFallback(v); }, 250);
        }
      };

      /* Timeout guard: if the Function is slow or DNS is misconfigured, fall
         through to mailto after 8s rather than leaving the visitor hanging. */
      var timer = window.setTimeout(function () { finish(false); }, 8000);

      var attempt = window.fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(v)
      });

      attempt.then(function (res) {
        window.clearTimeout(timer);
        if (res && res.ok) { finish(true); return; }
        /* 4xx from server: still record the lead via mailto so nothing is lost. */
        finish(false);
      }).catch(function () {
        window.clearTimeout(timer);
        finish(false);
      });
    });
  }

  /* ---------- hero video: always attempt autoplay, with interaction fallback ---------- */
  var heroVideo = document.querySelector(".hero__media video");
  if (heroVideo) {
    var attempt = function () {
      var p = heroVideo.play();
      if (p && typeof p.catch === "function") { p.catch(function () {}); }
    };
    attempt();
    /* if the browser blocked autoplay, start on the first interaction; poster shows until then */
    var kick = function () {
      attempt();
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      window.removeEventListener("touchstart", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    window.addEventListener("touchstart", kick);
  }

  /* ---------- index rows: hover/tap plays the project loop (one at a time) ----------
     Motion budget for the v2 index is this single mechanic. Rows without a
     <video> just show their still. Skipped entirely for reduced-motion and
     Save-Data, exactly like the hero. */
  var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  var saveData = !!(conn && conn.saveData);
  if (!reduceMotion && !saveData) {
    var loopRows = document.querySelectorAll(".row");
    var current = null;
    var stop = function (row) {
      if (!row) return;
      var v = row.querySelector(".row__media video");
      if (v) { v.pause(); try { v.currentTime = 0; } catch (e) {} }
      row.classList.remove("is-playing");
      if (current === row) current = null;
    };
    var start = function (row) {
      var v = row.querySelector(".row__media video");
      if (!v) return;
      if (current && current !== row) stop(current);
      current = row;
      row.classList.add("is-playing");
      var p = v.play();
      if (p && typeof p.catch === "function") { p.catch(function () {}); }
    };
    loopRows.forEach(function (row) {
      if (!row.querySelector(".row__media video")) return;
      row.addEventListener("pointerenter", function () { start(row); });
      row.addEventListener("pointerleave", function () { stop(row); });
      row.addEventListener("focus", function () { start(row); });
      row.addEventListener("blur", function () { stop(row); });
      row.addEventListener("touchstart", function () { start(row); }, { passive: true });
      row.addEventListener("touchend", function () { stop(row); }, { passive: true });
      row.addEventListener("touchcancel", function () { stop(row); }, { passive: true });
    });
  }

  /* ---------- footer year ---------- */
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- youtube facade (click to play) ---------- */
  var facades = document.querySelectorAll(".yt-facade[data-id]");
  facades.forEach(function (el) {
    function play() {
      var id = el.getAttribute("data-id");
      if (!id || el.dataset.loaded) return;
      el.dataset.loaded = "1";
      el.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id +
        '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    }
    el.addEventListener("click", play);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  });

  /* ---------- vimeo facade (click to play) ---------- */
  var vfs = document.querySelectorAll(".vimeo-facade[data-vimeo-id]");
  vfs.forEach(function (el) {
    function play() {
      var id = el.getAttribute("data-vimeo-id");
      if (!id || el.dataset.loaded) return;
      el.dataset.loaded = "1";
      el.innerHTML = '<iframe src="https://player.vimeo.com/video/' + id +
        '?autoplay=1&title=0&byline=0&portrait=0" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    }
    el.addEventListener("click", play);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  });

  /* ---------- logo-mark tap-tooltip (touch devices) ---------- */
  var isTouch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  if (isTouch) {
    var marks = document.querySelectorAll(".logo-mark[data-name]");
    marks.forEach(function (m) {
      var isLink = m.classList.contains("logo-mark--link");
      m.addEventListener("click", function (e) {
        var isOpen = m.getAttribute("data-open") === "1";
        if (isLink) {
          // First tap: reveal name, block navigation. Second tap (already open): let it navigate.
          if (!isOpen) {
            e.preventDefault();
            marks.forEach(function (n) { n.removeAttribute("data-open"); });
            m.setAttribute("data-open", "1");
          }
          // else: already open, allow default navigation to proceed.
          return;
        }
        // Tooltip-only mark: always just toggle, never navigate (no href anyway).
        e.preventDefault();
        var wasOpen = isOpen;
        marks.forEach(function (n) { n.removeAttribute("data-open"); });
        if (!wasOpen) m.setAttribute("data-open", "1");
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".logo-mark")) {
        marks.forEach(function (n) { n.removeAttribute("data-open"); });
      }
    }, true);
  }

  /* ---------- in-season sport (personality line) ---------- */
  var sportEls = document.querySelectorAll("[data-inseason-sport]");
  if (sportEls.length) {
    // Month index 0 = January ... 11 = December
    var byMonth = [
      "playoff football",     // Jan
      "playoff football",     // Feb
      "March Madness",        // Mar
      "baseball",             // Apr
      "the NBA playoffs",     // May
      "the NBA Finals",       // Jun
      "baseball",             // Jul
      "preseason football",   // Aug
      "college football",     // Sep
      "playoff baseball",     // Oct
      "football",             // Nov
      "bowl season"           // Dec
    ];
    var sport = byMonth[new Date().getMonth()] || "the game";
    sportEls.forEach(function (el) { el.textContent = sport; });
  }
})();
