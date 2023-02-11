export default function Paprika() {
	const spices = new Map();
	return {
		clear() {
			spices.forEach((spice) => spice.dispose() );
			spices.clear();
		},

		add(spice) {
			spices.set(spice.id, spice);
		},

		update(time) {
			if (!spices.size) {
				return;
			}
			time ||= window.performance.now();
			spices.forEach((spice, key) => {
				if (!spice.update(time)) {
					spices.delete(key);
					spice.dispose();
				}
			});
		}
	};
}
