/* ----- Theme Toggle ----- */
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function applyTheme(theme) {
	html.setAttribute("data-theme", theme);
	themeIcon.innerHTML = theme === "dark" ? SUN_SVG : MOON_SVG;
	localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
	applyTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ----- Sticky nav shadow ----- */
const navbar = document.getElementById("navbar");
window.addEventListener(
	"scroll",
	() => {
		navbar.classList.toggle("scrolled", window.scrollY > 20);
	},
	{ passive: true },
);

/* ----- Active nav link on scroll ----- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				navLinks.forEach((a) => {
					a.classList.toggle(
						"active",
						a.getAttribute("href") === "#" + entry.target.id,
					);
				});
			}
		});
	},
	{ rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((s) => observer.observe(s));

/* ----- Scroll reveal ----- */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add("visible");
				revealObserver.unobserve(e.target);
			}
		});
	},
	{ threshold: 0.12 },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ----- Hamburger ----- */
const hamburger = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
	navLinksEl.classList.toggle("open");
	hamburger.classList.toggle("open");
});
navLinksEl.querySelectorAll("a").forEach((a) =>
	a.addEventListener("click", () => {
		navLinksEl.classList.remove("open");
		hamburger.classList.remove("open");
	}),
);

/* ----- Close nav on outside click ----- */
document.addEventListener("click", (e) => {
	if (!navbar.contains(e.target)) {
		navLinksEl.classList.remove("open");
		hamburger.classList.remove("open");
	}
});
