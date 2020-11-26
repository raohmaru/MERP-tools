/**
 * Produce a random sample from the array.
 * @param {Array} arr
 * @returns {*}
 */
export function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}