/* ============================================================
   CURSOR — Lagging Ring + Magnetic + Text Label
============================================================ */
// At the very top of cursor.js — before anything else
if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
	document
		.querySelectorAll("#cursor-dot, #cursor-ring, #cursor-label")
		.forEach((el) => (el.style.display = "none"));
	// Stop the rest of the script from running
	throw new Error("Touch device — cursor disabled");
}

const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
const label = document.getElementById("cursor-label");

let mouseX = 0,
	mouseY = 0;
let ringX = 0,
	ringY = 0;

/* ---- 1. Track mouse position ---- */
document.addEventListener("mousemove", (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;

	// Dot snaps instantly
	dot.style.left = mouseX + "px";
	dot.style.top = mouseY + "px";

	// Label follows dot
	label.style.left = mouseX + "px";
	label.style.top = mouseY + "px";
});

/* ---- 2. Ring lags behind with lerp ---- */
function lerp(start, end, factor) {
	return start + (end - start) * factor;
}

function animateRing() {
	ringX = lerp(ringX, mouseX, 0.1); // 0.1 = lag amount (lower = more lag)
	ringY = lerp(ringY, mouseY, 0.1);

	ring.style.left = ringX + "px";
	ring.style.top = ringY + "px";

	requestAnimationFrame(animateRing);
}
animateRing();

/* ---- 3. Hide/show when leaving window ---- */
document.addEventListener("mouseleave", () => {
	document.body.classList.add("cursor-hidden");
});
document.addEventListener("mouseenter", () => {
	document.body.classList.remove("cursor-hidden");
});

/* ---- 4. Text label on hover ---- */
// Define which elements show which label
const labelTargets = [
	{ selector: "a[target]", text: "Open" },
	{ selector: ".btn-primary", text: "Go" },
	{ selector: ".btn-ghost", text: "Click" },
	{ selector: ".skill-chip", text: "Skill" },
];

labelTargets.forEach(({ selector, text }) => {
	document.querySelectorAll(selector).forEach((el) => {
		el.addEventListener("mouseenter", () => {
			label.textContent = text;
			label.classList.add("visible");
			document.body.classList.add("cursor-hover");
		});
		el.addEventListener("mouseleave", () => {
			label.classList.remove("visible");
			document.body.classList.remove("cursor-hover");
		});
	});
});

/* ---- 5. Magnetic effect on buttons ---- */
const magneticEls = document.querySelectorAll(
	".btn-primary, .btn-ghost, .icon-link",
);

magneticEls.forEach((el) => {
	el.addEventListener("mousemove", (e) => {
		const rect = el.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// How far the cursor is from the button center
		const deltaX = e.clientX - centerX;
		const deltaY = e.clientY - centerY;

		// Pull the button toward the cursor (strength = 0.3)
		el.style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
		el.style.transition = "transform 0.1s ease";

		document.body.classList.add("cursor-magnetic");
		document.body.classList.remove("cursor-hover");
	});

	el.addEventListener("mouseleave", () => {
		// Snap button back to original position
		el.style.transform = "translate(0px, 0px)";
		el.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

		document.body.classList.remove("cursor-magnetic");
	});
});
