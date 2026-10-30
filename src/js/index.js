import LoconativeScroll from "loconative-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copyText } from "./utils/index";
import { mapEach } from "./utils/dom";
import Time from "./components/Time";

const toContactButtons = document.querySelectorAll(".contact-scroll");
const footer = document.getElementById("js-footer");
const scrollEl = document.querySelector("[data-scroll-container]");
const emailButton = document.querySelector("button.email");
const toCopyText = document.querySelector(".to-copy span");
const time = new Time();

// --- Video + Sound ---
const video = document.querySelector(".hero__bg-video");
const soundBtn = document.querySelector(".sound-toggle");
const iconOn = soundBtn?.querySelector(".icon-sound-on");
const iconOff = soundBtn?.querySelector(".icon-sound-off");

if (soundBtn && video) {
  soundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    video.volume = 1;
    iconOn.style.display = video.muted ? "none" : "block";
    iconOff.style.display = video.muted ? "block" : "none";
  });
}

gsap.registerPlugin(ScrollTrigger);

const scroll = new LoconativeScroll({
  el: scrollEl,
  smooth: true,
  lerp: 0.06,
  tablet: {
    breakpoint: 768,
  },
});

setTimeout(() => {
  scroll.update();
}, 1000);

scroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(scroll.el, {
  scrollTop(value) {
    return arguments.length
      ? scroll.scrollTo(value, 0, 0)
      : scroll.scroll.instance.scroll.y;
  },

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

export default class Home {
  constructor(scroll) {
    this.locomotive = scroll;
    this.heroTextAnimation();
    this.homeIntro();
    this.homeAnimations();
    this.homeActions();
    this.initCustomCursor();
    this.initScrollBadgeAnimation();
  }

  homeActions() {
    mapEach(toContactButtons, (button) => {
      button.onclick = () => {
        this.locomotive.scrollTo(footer);
      };
    });

    emailButton.addEventListener("click", (e) => {
      copyText(e);
      toCopyText.textContent = "copied";

      setTimeout(() => {
        toCopyText.textContent = "Click To Copy";
      }, 2000);
    });
  }

  homeIntro() {
    const tl = gsap.timeline();

    gsap.to(scrollEl, {
      autoAlpha: 1,
    });

    tl.from(".home__nav", {
      duration: 0.5,
      delay: 0.3,
      opacity: 0,
      yPercent: -100,
      ease: "power4.out",
    })
      .from(".hero__title [title-overflow]", {
        duration: 0.7,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
        ease: "power4.out",
      })
      .from(
        ".hero__title .bottom__right",
        {
          duration: 1,
          yPercent: 100,
          opacity: 0,
          ease: "power4.out",
        },
        "<20%"
      )
      .set(".hero__title .overflow", { overflow: "unset" })
      .from(
        ".hero__title .mobile",
        {
          duration: 0.7,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        },
        "-=1.4"
      );
  }

  homeAnimations() {
    gsap.to(".home__projects__line", { autoAlpha: 1 });
    gsap.utils.toArray(".home__projects__line").forEach((el) => {
      const line = el.querySelector("span");
      gsap.from(line, {
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        scaleX: 0,
      });
    });

    gsap.utils.toArray("[data-fade-in]").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        duration: 1.5,
        yPercent: 100,
        opacity: 0,
        ease: "power4.out",
      });
    });

    if (window.innerWidth <= 768) {
      gsap.utils.toArray(".home__projects__project").forEach((el) => {
        const text = el.querySelector(".title__main");
        const link = el.querySelector(".project__link");
        gsap.from([text, link], {
          scrollTrigger: {
            trigger: el,
            scroller: "[data-scroll-container]",
          },
          duration: 1.5,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        });
      });

      const awardsTl = gsap.timeline({
        defaults: {
          ease: "power1.out",
        },
        scrollTrigger: {
          trigger: ".home__awards",
          scroller: "[data-scroll-container]",
        },
      });
      awardsTl.from(".awards__title span", {
        duration: 1,
        opacity: 0,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
      });
    }
  }

  heroTextAnimation() {
    gsap.to(".hero__title__dash.desktop", {
      scrollTrigger: {
        trigger: ".hero__title",
        scroller: "[data-scroll-container]",
        scrub: true,
        start: "-8% 9%",
        end: "110% 20%",
      },
      scaleX: 4,
      ease: "none",
    });
  }

  initCustomCursor() {
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.15;

    const xSetter = gsap.quickSetter(cursor, "x", "px");
    const ySetter = gsap.quickSetter(cursor, "y", "px");

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSetter(pos.x);
      ySetter(pos.y);
    });

    // Make cursor expand dynamically when hovering over clickable components
    const hoverSelectors = "a, button, .contact-scroll, .home__projects__project, .c-button";
    
    // We delegate the hovered checks to body element, to handle dynamically loaded elements as well!
    document.body.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSelectors)) {
        cursor.classList.add("hovered");
      }
    });

    document.body.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelectors)) {
        cursor.classList.remove("hovered");
      }
    });
  }

  initScrollBadgeAnimation() {
    const badge = document.querySelector(".rotating-scroll-badge svg");
    const hero = document.querySelector(".home__hero");

    // Hide video + sound btn when hero scrolls out
    if (video && hero && soundBtn) {
      this.locomotive.on("scroll", (obj) => {
        const heroH = hero.offsetHeight;
        const past = obj.scroll.y > heroH;
        video.classList.toggle("hidden", past);
        soundBtn.classList.toggle("hidden", past);
      });
    }

    if (!badge) return;

    let rotation = 0;
    this.locomotive.on("scroll", (obj) => {
      // Shift base rotation direction and speed based on real-time scroll velocity
      const velocity = obj.scroll.y - (this.locomotive.lastY || 0);
      this.locomotive.lastY = obj.scroll.y;
      rotation += velocity * 0.12;

      gsap.to(badge, {
        rotate: rotation,
        overwrite: "auto",
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }
}

new Home(scroll);
