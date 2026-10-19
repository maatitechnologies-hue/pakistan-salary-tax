// Expected values worked out by hand from the FBR table (see README "Source").
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../src/pakistan-salary-tax.js');

const near = (a, b) => assert.ok(Math.abs(a - b) < 0.005, `${a} != ${b}`);

test('Tax Year 2027 at every threshold and in between', () => {
  const cases = { 0: 0, 600000: 0, 1200000: 6000, 2200000: 116000, 2400000: 156000, 3200000: 316000, 4100000: 541000,
    5600000: 976000, 6000000: 1104000, 7000000: 1424000, 12000000: 3174000, 24000000: 7374000 };
  for (const [income, tax] of Object.entries(cases)) near(T.annualTax(Number(income)).tax, tax);
});

test('no surcharge on salary in Tax Year 2027', () => {
  assert.equal(T.annualTax(50000000).surcharge, 0);
});

test('Tax Year 2026 including the 9% salaried surcharge above Rs 10 million', () => {
  near(T.annualTax(2400000, { taxYear: 2026 }).tax, 162000);
  near(T.annualTax(4100000, { taxYear: 2026 }).tax, 616000);
  const r = T.annualTax(12000000, { taxYear: 2026 });
  near(r.surcharge, 3381000 * 0.09);
  near(r.tax, 3381000 * 1.09);
});

test('slab boundaries: a threshold belongs to the lower slab', () => {
  assert.equal(T.annualTax(600000).slab, 0);
  assert.equal(T.annualTax(600001).slab, 1);
  assert.equal(T.annualTax(7000000).slab, 6);
  assert.equal(T.annualTax(7000001).slab, 7);
});

test('monthly helper with bonus', () => {
  const m = T.monthly(200000);
  near(m.annualTax, 156000); near(m.monthlyTax, 13000); near(m.monthlyTakeHome, 187000); near(m.effectiveRate, 6.5);
  const b = T.monthly(200000, { bonus: 600000 });
  near(b.annualIncome, 3000000); near(b.annualTax, 276000);
});

test('slab table and labels', () => {
  const s = T.slabs(2027);
  assert.equal(s.length, 8);
  assert.deepEqual(s[7], { from: 7000000, to: null, fixed: 1424000, rate: 35 });
  assert.match(T.label(2027), /Tax Year 2027/);
  assert.throws(() => T.annualTax(1, { taxYear: 2020 }), RangeError);
});

test('negative or invalid input is treated as zero', () => {
  assert.equal(T.annualTax(-5).tax, 0);
  assert.equal(T.annualTax('abc').tax, 0);
});
