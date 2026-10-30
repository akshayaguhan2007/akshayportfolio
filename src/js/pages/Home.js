import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const video = document.querySelector(".hero__bg-video");
const hero = document.querySelector(".home__hero");
const soundBtn = document.querySelector(".sound-toggle");
const iconOn = soundBtn?.querySelector(".icon-sound-on");
const iconOff = soundBtn?.querySelector(".icon-sound-off");

function updateIcons() {
  if (!iconOn || !iconOff) return;
  iconOn.style.display = video.muted ? "none" : "block";
  iconOff.style.display = video.muted ? "block" : "none";
}

if (video && hero) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      video.classList.toggle("hidden", !entry.isIntersecting);
      soundBtn?.classList.toggle("hidden", !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}

if (soundBtn && video) {
  soundBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const wasMuted = video.muted;
    video.muted = !wasMuted;
    video.volume = 1;
    if (wasMuted) {
      video.play().catch(() => { video.muted = true; updateIcons(); });
    }
    updateIcons();
  });
}
