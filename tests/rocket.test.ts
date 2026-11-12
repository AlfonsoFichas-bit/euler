import { describe, expect, test } from '@rstest/core';
import {
  type RocketParams,
  type StepComparison,
  DEFAULT_PARAMS,
  validateParams,
  simulateEuler,
  analytical,
  simulate,
  compareSteps,
  formatNumber,
  parseDecimal,
} from '../src/lib/rocket';

// ---------- Helpers ----------

/** Reference Euler table from the document (h = 2, default params). */
const EULER_TABLE_H2 = [
  { t: 0, v: 0.0, y: 0.0 },
  { t: 2, v: 10.38, y: 0.0 },
  { t: 4, v: 18.684, y: 20.76 },
  { t: 6, v: 25.3272, y: 58.128 },
  { t: 8, v: 30.6418, y: 108.7824 },
  { t: 10, v: 34.8934, y: 170.0659 },
  { t: 12, v: 38.2947, y: 239.8527 },
  { t: 14, v: 41.0158, y: 316.4422 },
  { t: 16, v: 43.1926, y: 398.4738 },
  { t: 18, v: 44.9341, y: 484.859 },
  { t: 20, v: 46.3273, y: 574.7272 },
];

// ---------- 2.1 — validateParams ----------

describe('validateParams', () => {
  test('accepts default params', () => {
    expect(validateParams(DEFAULT_PARAMS)).toEqual([]);
  });

  test('rejects zero mass', () => {
    const issues = validateParams({ ...DEFAULT_PARAMS, m: 0 });
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues.some((i) => i.field === 'm')).toBe(true);
  });

  test('rejects zero step', () => {
    const issues = validateParams({ ...DEFAULT_PARAMS, h: 0 });
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues.some((i) => i.field === 'h')).toBe(true);
  });

  test('rejects step that does not divide tEnd', () => {
    const issues = validateParams({ ...DEFAULT_PARAMS, h: 3 });
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues.some((i) => i.field === 'h')).toBe(true);
    expect(
      issues.some((i) => i.message.includes('dividir exactamente')),
    ).toBe(true);
  });

  test('rejects negative mass', () => {
    const issues = validateParams({ ...DEFAULT_PARAMS, m: -5 });
    expect(issues.some((i) => i.field === 'm')).toBe(true);
  });

  test('rejects NaN tEnd', () => {
    const issues = validateParams({ ...DEFAULT_PARAMS, tEnd: NaN });
    expect(issues.some((i) => i.field === 'tEnd')).toBe(true);
  });

  test('rejects zero tEnd', () => {
    const issues = validateParams({ ...DEFAULT_PARAMS, tEnd: 0 });
    expect(issues.some((i) => i.field === 'tEnd')).toBe(true);
  });
});

// ---------- 2.2 — Euler integration ----------

describe('simulateEuler', () => {
  test('full table matches document for h = 2', () => {
    const iterations = simulateEuler(DEFAULT_PARAMS);
    expect(iterations).toHaveLength(11);

    for (let i = 0; i < EULER_TABLE_H2.length; i++) {
      const ref = EULER_TABLE_H2[i];
      const got = iterations[i];
      expect(got.t).toBeCloseTo(ref.t, 4);
      expect(got.v).toBeCloseTo(ref.v, 4);
      expect(got.y).toBeCloseTo(ref.y, 4);
    }
  });

  test('y₁ = 0 (height at first step)', () => {
    const iterations = simulateEuler(DEFAULT_PARAMS);
    expect(iterations[1].y).toBeCloseTo(0, 4);
  });

  test('v₂₀ = 46.3273', () => {
    const iterations = simulateEuler(DEFAULT_PARAMS);
    expect(iterations[10].v).toBeCloseTo(46.3273, 4);
  });

  test('y₂₀ = 574.7272', () => {
    const iterations = simulateEuler(DEFAULT_PARAMS);
    expect(iterations[10].y).toBeCloseTo(574.7272, 4);
  });

  test('non-zero initial velocity', () => {
    const params: RocketParams = { ...DEFAULT_PARAMS, v0: 5 };
    const iterations = simulateEuler(params);
    expect(iterations[0].v).toBe(5);
    // First Euler step: v1 = 5 + 2*(5.19 - 0.1*5)
    const expectedV1 = 5 + 2 * (15000 / 1000 - 9.81 - (100 / 1000) * 5);
    expect(iterations[1].v).toBeCloseTo(expectedV1, 10);
  });
});

// ---------- 2.3 — Analytical solution ----------

describe('analytical', () => {
  test('exact velocity at 20 s = 44.8761', () => {
    const exact = analytical(DEFAULT_PARAMS, 20);
    expect(exact.v).toBeCloseTo(44.8761, 4);
  });

  test('exact height at 20 s = 589.2390', () => {
    const exact = analytical(DEFAULT_PARAMS, 20);
    expect(exact.y).toBeCloseTo(589.239, 4);
  });

  test('v₀ = 2, y₀ = 10 at t = 0', () => {
    const params: RocketParams = { ...DEFAULT_PARAMS, v0: 2, y0: 10 };
    const exact = analytical(params, 0);
    expect(exact.v).toBeCloseTo(2, 10);
    expect(exact.y).toBeCloseTo(10, 10);
  });

  test('handles zero drag (B = 0) with the limit form', () => {
    const params: RocketParams = { ...DEFAULT_PARAMS, k: 0, v0: 2, y0: 10 };
    const exact = analytical(params, 3);
    const A = params.T / params.m - params.g;
    expect(exact.v).toBeCloseTo(2 + A * 3, 10);
    expect(exact.y).toBeCloseTo(10 + 2 * 3 + 0.5 * A * 9, 10);
  });

  test('errors match document', () => {
    const sim = simulate(DEFAULT_PARAMS);
    expect(sim.errors.v).toBeCloseTo(1.4512, 4);
    expect(sim.errors.y).toBeCloseTo(14.5118, 4);
  });
});

// ---------- 2.4 — compareSteps ----------

describe('compareSteps', () => {
  const rows = compareSteps(DEFAULT_PARAMS);

  test('includes four step sizes plus exact row', () => {
    expect(rows).toHaveLength(5);
    expect(rows[rows.length - 1].h).toBe('exact');
  });

  test('h = 2 velocity = 46.3273', () => {
    const row = rows.find((r) => r.h === 2)!;
    expect(row.v).toBeCloseTo(46.3273, 4);
  });

  test('h = 1 velocity = 45.5902', () => {
    const row = rows.find((r) => r.h === 1)!;
    expect(row.v).toBeCloseTo(45.5902, 4);
  });

  test('h = 0.5 velocity = 45.2302', () => {
    const row = rows.find((r) => r.h === 0.5)!;
    expect(row.v).toBeCloseTo(45.2302, 4);
  });

  test('h = 0.25 velocity = 45.0524', () => {
    const row = rows.find((r) => r.h === 0.25)!;
    expect(row.v).toBeCloseTo(45.0524, 4);
  });

  test('h = 2 height = 574.7272', () => {
    const row = rows.find((r) => r.h === 2)!;
    expect(row.y).toBeCloseTo(574.7272, 4);
  });

  test('h = 1 height = 582.0983', () => {
    const row = rows.find((r) => r.h === 1)!;
    expect(row.y).toBeCloseTo(582.0983, 4);
  });

  test('h = 0.5 height = 585.6978', () => {
    const row = rows.find((r) => r.h === 0.5)!;
    expect(row.y).toBeCloseTo(585.6978, 4);
  });

  test('h = 0.25 height = 587.4757', () => {
    const row = rows.find((r) => r.h === 0.25)!;
    expect(row.y).toBeCloseTo(587.4757, 4);
  });

  test('exact row values', () => {
    const exact = rows.find((r) => r.h === 'exact')!;
    expect(exact.v).toBeCloseTo(44.8761, 4);
    expect(exact.y).toBeCloseTo(589.239, 4);
    expect(exact.vError).toBe(0);
    expect(exact.yError).toBe(0);
  });

  test('errors decrease as step decreases (convergence)', () => {
    const numericRows = rows.filter(
      (r): r is StepComparison & { h: number } => typeof r.h === 'number',
    );
    for (let i = 1; i < numericRows.length; i++) {
      expect(numericRows[i].vError).toBeLessThan(numericRows[i - 1].vError);
      expect(numericRows[i].yError).toBeLessThan(numericRows[i - 1].yError);
    }
  });

  test('omits non-applicable step', () => {
    // tEnd = 7 is not divisible by 2 or 0.25 (well, 0.25 divides it)
    const params: RocketParams = { ...DEFAULT_PARAMS, tEnd: 7, h: 1 };
    const result = compareSteps(params);
    // h=2 does not divide 7
    expect(result.find((r) => r.h === 2)).toBeUndefined();
    // h=1 divides 7
    expect(result.find((r) => r.h === 1)).toBeDefined();
  });
});

// ---------- 2.5 — Parsing and formatting ----------

describe('parseDecimal', () => {
  test('parses 9,81 (comma)', () => {
    expect(parseDecimal('9,81')).toBeCloseTo(9.81, 10);
  });

  test('parses 9.81 (dot)', () => {
    expect(parseDecimal('9.81')).toBeCloseTo(9.81, 10);
  });

  test('rejects 1.000 as ambiguous thousands', () => {
    expect(parseDecimal('1.000')).toBeNaN();
  });

  test('rejects dot+comma ambiguity (1.000,5)', () => {
    expect(parseDecimal('1.000,5')).toBeNaN();
  });

  test('rejects multiple commas', () => {
    expect(parseDecimal('1,000,5')).toBeNaN();
  });

  test('rejects multiple dots', () => {
    expect(parseDecimal('1.000.5')).toBeNaN();
  });

  test('trims whitespace', () => {
    expect(parseDecimal('  3,14  ')).toBeCloseTo(3.14, 10);
  });

  test('returns NaN for empty string', () => {
    expect(parseDecimal('')).toBeNaN();
  });
});

describe('formatNumber', () => {
  test('formats 46.3273 as 46,3273', () => {
    expect(formatNumber(46.3273)).toBe('46,3273');
  });

  test('formats 0 with four decimals', () => {
    expect(formatNumber(0)).toBe('0,0000');
  });

  test('formats 574.7272 as 574,7272', () => {
    expect(formatNumber(574.7272)).toBe('574,7272');
  });

  test('formats 589.239 with four decimals', () => {
    expect(formatNumber(589.239)).toBe('589,2390');
  });
});

// ---------- Independence of state ----------

describe('independence', () => {
  test('two consecutive simulations are independent', () => {
    const sim1 = simulate(DEFAULT_PARAMS);
    const sim2 = simulate({ ...DEFAULT_PARAMS, h: 1 });

    // sim2 starts from v0, y0, not from sim1 final values
    expect(sim2.iterations[0].v).toBe(DEFAULT_PARAMS.v0);
    expect(sim2.iterations[0].y).toBe(DEFAULT_PARAMS.y0);

    // Different step → different final values
    expect(sim2.iterations[sim2.iterations.length - 1].v).not.toBeCloseTo(
      sim1.iterations[sim1.iterations.length - 1].v,
      4,
    );
  });
});
