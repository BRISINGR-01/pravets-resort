const main = document.querySelector("main");
const map = document.getElementById("map");
const mapImg = map.children[0];
const imgHolder = document.getElementById("image-holder");
const modeSwitch = document.getElementById("weather-dial");
let snowAnim;
let snowyImgData;
let data = {};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();

Promise.allSettled([
	new Promise((resolve, reject) => {
		img.crossOrigin = "anonymous";
		img.src = "./photos/pravets-map.jpg";
		img.onload = () => resolve();
	}),
	new Promise((resolve, reject) => {
		fetch("./photos.json")
			.catch(reject)
			.then((val) => val.json())
			.then((val) => {
				for (const type in val) {
					val[type] = val[type].map((p) => {
						p.images = p.images.map((src) => ({
							el: null,
							src,
						}));
						return p;
					});
				}
				data = val;
				resolve();
			});
	}),
]).then(setUp);

function setUp() {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
	snowSetup();
	modeSwitch.children[0].click();
}

[...modeSwitch.children].forEach((el) =>
	el.addEventListener("click", () => {
		[...modeSwitch.children].forEach((otherEl) =>
			otherEl.classList.remove("chosen-mode")
		);
		el.classList.add("chosen-mode");
		while (map.children.length > 1) {
			map.removeChild(map.lastChild);
		}
		if (!el.alt) {
			for (const type in data) {
				data[type].map(addPoint);
			}
		} else {
			data[el.alt].map(addPoint);
		}
		document.getElementsByClassName("point")[0].classList.add("point-ap");

		cancelAnimationFrame(snowAnim);
		ctx.drawImage(img, 0, 0);

		switch (el.alt) {
			case "night":
				mapImg.style.filter = "brightness(0.2) saturate(0.2)";
				break;
			case "sunset":
				mapImg.style.filter =
					"brightness(0.6) hue-rotate(330deg) saturate(1.8)";
				break;
			case "autumn":
				mapImg.style.filter =
					"brightness(0.7) hue-rotate(335deg) saturate(1.4)";
				break;

			case "fog":
				mapImg.style.filter = "brightness(0.9) invert(0.3)";
				break;
			case "winter":
				mapImg.style.filter = "brightness(0.9)";
				snowAnim = requestAnimationFrame(snow);

				ctx.putImageData(snowyImgData, 0, 0);

				break;

			default:
				mapImg.style.filter = "brightness(0.9)";
				break;
		}
	})
);

function addPoint(p) {
	p.images.forEach((image) => {
		image.el = document.createElement("img");
		image.el.classList.add("image");
	});

	const point = document.createElement("div");
	map.appendChild(point);

	point.classList.add("point");
	point.style.top = p.coordinates.t + "%";
	point.style.left = p.coordinates.l + "%";
	point.addEventListener("click", () => onPointClick(p));
}

function onPointClick(p) {
	if (p.images.length === 0) return;
	imgHolder.parentElement.style.display = "flex";

	p.images.forEach((image, i) => {
		image.el.src ||= `./photos/${image.src}`;
		imgHolder.appendChild(image.el);
	});

	Promise.all(
		p.images.map(
			({ el }) =>
				new Promise((resolve, reject) => {
					el.onload = () => resolve();
				})
		)
	).then(() => {
		imgHolder.style.alignContent =
			window.innerWidth < imgHolder.lastChild.getBoundingClientRect().right
				? "flex-start"
				: "center";
	});

	imgHolder.style.alignContent =
		window.innerWidth < imgHolder.lastChild.getBoundingClientRect().right
			? "flex-start"
			: "center";
}

function close() {
	imgHolder.parentElement.style.display = "none";
	while (imgHolder.firstChild) {
		imgHolder.removeChild(imgHolder.firstChild);
	}
}

imgHolder.parentElement.addEventListener("click", close);
window.addEventListener("keydown", (e) => {
	if (e.code === "Escape") close();
});

const snowflakes = [];
function snowSetup() {
	snowyImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < snowyImgData.data.length; i += 4) {
		const [r, g, b] = snowyImgData.data.slice(i, i + 3);
		const whiten = () => {
			if (r > 120 && g > 120 && b < 100) {
				snowyImgData.data[i + 0] += 270;
				snowyImgData.data[i + 1] += 270;
				snowyImgData.data[i + 2] += 270;
			} else {
				snowyImgData.data[i + 0] = 300 - r;
				snowyImgData.data[i + 1] = 300 - g;
				snowyImgData.data[i + 2] = 300 - b;
			}
		};
		if (Math.abs(r - g) < 120) whiten();
	}
	for (let i = 0; i < 300; i++) {
		snowflakes.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
		});
	}
}

function snow() {
	ctx.putImageData(snowyImgData, 0, 0);

	for (const snowflake of snowflakes) {
		ctx.beginPath();
		ctx.arc(snowflake.x, snowflake.y, 2, 0, 2 * Math.PI, false);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.stroke();
		ctx.lineWidth = 1;

		snowflake.y += 0.1;
		if (snowflake.y > canvas.height) snowflake.y = 0;
	}
	snowAnim = requestAnimationFrame(snow);
}
