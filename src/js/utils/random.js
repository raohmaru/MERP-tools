/**
 * Produce a random sample from the array.
 * @param {Array} arr
 * @returns {*}
 */
export function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random float number between two values (inclusive of `min`, but not `max`).
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} - Float number
 */
export function random(min, max) {
	if(!max) {
		if(!min) {
			return Math.random();
		}
		max = min;
		min = 0;
	}
	return Math.random()*(max-min) + min;
}

/**
 * Generates a random integer number between two values, both inclusive.
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number} - Integer number
 */
export function randomInt(min, max) {
	return Math.floor( random(min, max + 1) );
}