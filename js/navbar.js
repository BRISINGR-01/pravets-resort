const iconEnglish = document.getElementById("english");
const iconBulgarian = document.getElementById("bulgarian");
const isDefaultEnglish = document.cookie.includes("language=en");

let animationTimeout = null;
const opacity = [{ opacity: "1" }, { opacity: "0" }];
const reverseOpacity = [{ opacity: "0" }, { opacity: "1" }];
const timing = {
	duration: 250,
	iterations: 1,
};

toggle(isDefaultEnglish);

translate(isDefaultEnglish, false);

const switchLanguageTo = (lang) => {
	document.cookie = `language=${lang}`;
	const isToEnglish = lang === "en";
	translate(isToEnglish);

	clearTimeout(animationTimeout);
	fadeOut(!isToEnglish ? iconEnglish : iconBulgarian);
	animationTimeout = setTimeout(() => {
		toggle(isToEnglish);
		fadeIn(isToEnglish ? iconBulgarian : iconEnglish);
	}, 250);
};

function toggle(isToEnglish) {
	iconEnglish.style.display = isToEnglish ? "block" : "none";
	iconBulgarian.style.display = !isToEnglish ? "block" : "none";
}

function translate(isEnglish, shouldFade = true) {
	document.title = document
		.querySelector(`meta[name=title-${isEnglish ? "en" : "bg"}]`)
		.getAttribute("content");
	for (const el of document.querySelectorAll("[data-en][data-bg]")) {
		if (shouldFade) fadeOut(el); // flickers (not just fade -> disappear)
		setTimeout(() => {
			el.innerHTML = isEnglish ? el.dataset.en : el.dataset.bg;
		}, timing.duration);
	}
}

function fadeOut(el) {
	el.animate(opacity, timing);
}

function fadeIn(el) {
	el.animate(reverseOpacity, timing);
}

iconEnglish.addEventListener("click", () => switchLanguageTo("bg"));
iconBulgarian.addEventListener("click", () => switchLanguageTo("en"));

const modal = document.getElementById("contactsModal");
const btn = document.getElementById("contactsBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = () => {
	modal.style.display = "flex";
};

span.onclick = () => {
	modal.style.display = "none";
};

window.addEventListener("click", (event) => {
	if (event.target == modal) modal.style.display = "none";
});
