// const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
// gets nested object value
export const getNestedValue = (path, obj) => {
	return path.reduce((currentObj, currentKey) => (currentObj && currentObj[currentKey] ? currentObj[currentKey] : null), obj)
}
