const isPromise = require('./index.js');

// Benchmark helper
function benchmark(name, fn, iterations = 1000000) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1e6; // Convert to milliseconds
  const opsPerSec = (iterations / duration) * 1000;

  console.log(`${name.padEnd(40)} ${duration.toFixed(2).padStart(10)}ms  ${opsPerSec.toFixed(0).padStart(15)} ops/sec`);
  return { duration, opsPerSec };
}

console.log('='.repeat(80));
console.log('is-promise Performance Benchmark Suite');
console.log('='.repeat(80));
console.log('Test Case'.padEnd(40) + 'Time (ms)'.padStart(12) + 'Ops/sec'.padStart(18));
console.log('-'.repeat(80));

// Test cases
const nativePromise = Promise.resolve(42);
const promiseLike = { then: function() {} };
const funcWithThen = function() {};
funcWithThen.then = function() {};

const nullValue = null;
const undefinedValue = undefined;
const numberValue = 42;
const stringValue = 'test';
const boolValue = true;
const plainObject = {};
const arrayValue = [];
const plainFunc = function() {};

const results = {
  'Native Promise (fast path)': benchmark('Native Promise (fast path)', () => isPromise(nativePromise)),
  'Promise-like object': benchmark('Promise-like object', () => isPromise(promiseLike)),
  'Function with then property': benchmark('Function with then property', () => isPromise(funcWithThen)),
  'null (fast path)': benchmark('null (fast path)', () => isPromise(nullValue)),
  'undefined (fast path)': benchmark('undefined (fast path)', () => isPromise(undefinedValue)),
  'number': benchmark('number', () => isPromise(numberValue)),
  'string': benchmark('string', () => isPromise(stringValue)),
  'boolean': benchmark('boolean', () => isPromise(boolValue)),
  'plain object': benchmark('plain object', () => isPromise(plainObject)),
  'array': benchmark('array', () => isPromise(arrayValue)),
  'plain function': benchmark('plain function', () => isPromise(plainFunc)),
};

console.log('='.repeat(80));
console.log('\nPerformance Summary:');
console.log('-'.repeat(80));

// Calculate totals
const totalOps = Object.values(results).reduce((sum, r) => sum + r.opsPerSec, 0);
const avgOpsPerSec = totalOps / Object.keys(results).length;

console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);
console.log(`Total iterations: ${1000000 * Object.keys(results).length}`);

// Find fastest and slowest
const entries = Object.entries(results);
const fastest = entries.reduce((max, [name, r]) => r.opsPerSec > max.opsPerSec ? { name, ...r } : max, { name: '', opsPerSec: 0 });
const slowest = entries.reduce((min, [name, r]) => r.opsPerSec < min.opsPerSec ? { name, ...r } : min, { name: '', opsPerSec: Infinity });

console.log(`\nFastest: ${fastest.name} (${fastest.opsPerSec.toFixed(0)} ops/sec)`);
console.log(`Slowest: ${slowest.name} (${slowest.opsPerSec.toFixed(0)} ops/sec)`);
console.log(`Speedup factor: ${(fastest.opsPerSec / slowest.opsPerSec).toFixed(2)}x`);

console.log('='.repeat(80));
console.log('\nOptimizations Applied:');
console.log('  1. Fast null/undefined check with single == null comparison');
console.log('  2. Native Promise instanceof fast path (cached)');
console.log('  3. Type check before property access (typeof obj cached)');
console.log('  4. Single property access for then check (cached in variable)');
console.log('='.repeat(80));
