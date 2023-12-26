for (const container of document.getElementsByClassName("images-container")) {
	let interval;
	const imgCount = container.children.length;

	reset(container.children);

	container.addEventListener("mouseenter", () => {
		const nodes = [...container.children];

		function spread() {
			let l = 10 - imgCount;

			let i = -imgCount / 2;
			for (const img of nodes) {
				img.style.transform = `rotateZ(${i * 7.5}deg) translate(${
					30 + i * 10 * l
				}%, ${i * 20}%) scale(2.3)`;
				i++;
				const z = Math.round(10 + i);
				setTimeout(() => {
					img.style.zIndex = z;
				}, 200);
			}
		}

		spread(nodes);

		interval = setInterval(() => {
			const last = nodes[nodes.length - 1];
			nodes.pop();
			nodes.unshift(last);

			last.style.transform = `rotateZ(${-2 * 7.5}deg) translate(${
				30 + -3 * 200
			}%, ${-2 * 100}%) scale(.8)`;

			setTimeout(() => {
				last.style.zIndex = 0;
				spread(nodes);
			}, 200);
		}, 1500);
	});

	function stop() {
		clearInterval(interval);
		reset(container.children);
	}

	container.addEventListener("mouseleave", stop);
}

function reset(nodes) {
	let i = -nodes.length / 2;

	for (const img of nodes) {
		img.style.transform = `rotateZ(${i * 5}deg)`;
		i++;
	}
}
