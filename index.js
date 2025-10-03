module.exports = isPromise;
module.exports.default = isPromise;

// Cache for native Promise constructor check
var nativePromise = typeof Promise !== 'undefined' ? Promise : null;

function isPromise(obj) {
  // Fast path 1: Null/undefined check with single comparison
  if (obj == null) return false;

  // Fast path 2: Native Promise instanceof check (fastest for native promises)
  if (nativePromise && obj instanceof nativePromise) return true;

  // Fast path 3: Type check optimization - check type first before accessing properties
  var type = typeof obj;
  if (type !== 'object' && type !== 'function') return false;

  // Fast path 4: Optimized then check - only one property access
  var then = obj.then;
  return typeof then === 'function';
}
