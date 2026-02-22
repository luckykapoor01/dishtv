const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

/* ===============================
   IPTV COUNTDOWN TIMER
================================ */

const iptvTargetDate = new Date();
iptvTargetDate.setDate(iptvTargetDate.getDate() + 7); // 7 days from now

function iptvUpdateCountdown() {

  const now = new Date().getTime();
  const distance = iptvTargetDate - now;

  if (distance < 0) return;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("iptv-days").innerText = String(days).padStart(2, '0');
  document.getElementById("iptv-hours").innerText = String(hours).padStart(2, '0');
  document.getElementById("iptv-minutes").innerText = String(minutes).padStart(2, '0');
  document.getElementById("iptv-seconds").innerText = String(seconds).padStart(2, '0');
}

setInterval(iptvUpdateCountdown, 1000);
iptvUpdateCountdown();

/* =====================================
   IPTV CAROUSEL LOGIC
===================================== */

const track = document.querySelector(".iptv-carousel__track");
const items = document.querySelectorAll(".iptv-carousel__item");
const prevBtn = document.querySelector(".iptv-carousel__arrow--left");
const nextBtn = document.querySelector(".iptv-carousel__arrow--right");

let index = 0;
let autoSlideInterval;
const itemWidth = items[0].offsetWidth + 30; // item + gap
const visibleItems = Math.floor(track.parentElement.offsetWidth / itemWidth);

/* Clone for infinite loop */
items.forEach(item => {
  const clone = item.cloneNode(true);
  track.appendChild(clone);
});

function updateCarousel() {
  track.style.transform = `translateX(-${index * itemWidth}px)`;
}

/* Next */
function nextSlide() {
  index++;
  if (index >= items.length) {
    setTimeout(() => {
      track.style.transition = "none";
      index = 0;
      updateCarousel();
      requestAnimationFrame(() => {
        track.style.transition = "transform 0.6s ease";
      });
    }, 600);
  }
  updateCarousel();
}

/* Prev */
function prevSlide() {
  if (index === 0) {
    track.style.transition = "none";
    index = items.length;
    updateCarousel();
    requestAnimationFrame(() => {
      track.style.transition = "transform 0.6s ease";
      index--;
      updateCarousel();
    });
  } else {
    index--;
    updateCarousel();
  }
}

/* Auto Slide */
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 3500);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

/* Events */
nextBtn.addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  stopAutoSlide();
  prevSlide();
  startAutoSlide();
});

track.addEventListener("mouseenter", stopAutoSlide);
track.addEventListener("mouseleave", startAutoSlide);

/* Init */
startAutoSlide();


const switchEl = document.getElementById("iptvPlanSwitch");
const labels = document.querySelectorAll(".iptv-plans__label");
const monthly = document.querySelector(".iptv-plans__grid--monthly");
const yearly = document.querySelector(".iptv-plans__grid--yearly");

function activatePlan(plan) {

  labels.forEach(l => l.classList.remove("iptv-plans__label--active"));

  if (plan === "yearly") {
    labels[1].classList.add("iptv-plans__label--active");
    switchEl.classList.add("iptv-plans__switch--yearly");
    monthly.classList.remove("iptv-plans__grid--active");
    yearly.classList.add("iptv-plans__grid--active");
  } else {
    labels[0].classList.add("iptv-plans__label--active");
    switchEl.classList.remove("iptv-plans__switch--yearly");
    yearly.classList.remove("iptv-plans__grid--active");
    monthly.classList.add("iptv-plans__grid--active");
  }
}

labels[0].addEventListener("click", () => activatePlan("monthly"));
labels[1].addEventListener("click", () => activatePlan("yearly"));

switchEl.addEventListener("click", () => {
  const isYearly = switchEl.classList.contains("iptv-plans__switch--yearly");
  activatePlan(isYearly ? "monthly" : "yearly");
});


const codeEl = document.getElementById("iptvHumanCode");
const refreshBtn = document.getElementById("iptvRefreshCode");

function generateCode() {
  return Math.floor(100 + Math.random() * 900);
}

refreshBtn.addEventListener("click", () => {
  codeEl.textContent = generateCode();
});


/* =====================================
   IPTV STATS COUNT-UP ANIMATION
===================================== */

const iptvCounters = document.querySelectorAll(".iptv-stat h3");
let iptvCountersStarted = false;

function iptvAnimateCounters() {
  iptvCounters.forEach(counter => {
    const target = +counter.dataset.count;
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = progress * (2 - progress); // easeOutQuad
      const value = Math.floor(eased * target);

      counter.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  });
}

/* Trigger on scroll (once) */
const iptvStatsSection = document.querySelector(".iptv-stats-promo");

const iptvObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !iptvCountersStarted) {
      iptvCountersStarted = true;
      iptvAnimateCounters();
    }
  });
}, { threshold: 0.4 });

iptvObserver.observe(iptvStatsSection);


const referCodeEl = document.getElementById("iptvReferCode");
const referRefresh = document.getElementById("iptvReferRefresh");

function generateReferCode() {
  return Math.floor(100 + Math.random() * 900);
}

referRefresh.addEventListener("click", () => {
  referCodeEl.textContent = generateReferCode();
});


