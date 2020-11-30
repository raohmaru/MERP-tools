/**
 * Flattens an object a single level deep.
 * @param {Object} obj 
 * @returns {Object}
 */
export function flat(obj) {
    const flatObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const val = obj[key];
            if (typeof val === "object") {
                Object.assign(flatObj, flat(val));
            } else {
                flatObj[key] = val;
            }
        }
    }
    return flatObj;
}