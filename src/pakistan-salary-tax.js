/*!
 * pakistan-salary-tax — Pakistan income tax on salary (Tax Year 2027 and 2026)
 * https://github.com/maatitechnologies-hue/pakistan-salary-tax
 * Online calculator: https://mentormakers.pk/tools/pakistan-tax-calculator
 * (c) 2026 Maati Tech Private Limited — MIT License
 *
 * Source: Income Tax Ordinance, 2001 (FBR consolidated text, amended up to 30 June 2026),
 * First Schedule, Part I, Division I, clause (2): rates for individuals whose income under the
 * head "Salary" exceeds 75% of taxable income. Surcharge: section 4AB. Checked 19 October 2026.
 * Not tax advice: exemptions, tax credits and withholding adjustments are not included.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.PakistanSalaryTax = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // [threshold, fixed tax at threshold, rate % on the amount above threshold]
    var YEARS = {
        2027: {
            label: 'Tax Year 2027 (1 July 2026 – 30 June 2027)',
            slabs: [[0, 0, 0], [600000, 0, 1], [1200000, 6000, 11], [2200000, 116000, 20], [3200000, 316000, 25],
                    [4100000, 541000, 29], [5600000, 976000, 32], [7000000, 1424000, 35]],
            // Section 4AB proviso (Finance Act 2026): no surcharge on income under the head "Salary".
            surcharge: null
        },
        2026: {
            label: 'Tax Year 2026 (1 July 2025 – 30 June 2026)',
            slabs: [[0, 0, 0], [600000, 0, 1], [1200000, 6000, 11], [2200000, 116000, 23], [3200000, 346000, 30],
                    [4100000, 616000, 35]],
            // Section 4AB as it read before the Finance Act 2026: 9% of the tax for salaried individuals above Rs 10 million.
            surcharge: { above: 10000000, rate: 9 }
        }
    };

    function year(taxYear) {
        var y = YEARS[taxYear == null ? 2027 : taxYear];
        if (!y) throw new RangeError('Unsupported tax year: ' + taxYear + '. Supported: ' + Object.keys(YEARS).join(', '));
        return y;
    }

    /**
     * Tax for a year's taxable salary income (rupees).
     * @returns {{tax:number, slab:number, rate:number, surcharge:number, effectiveRate:number, taxYear:number}}
     */
    function annualTax(income, options) {
        var o = options || {};
        var taxYear = o.taxYear == null ? 2027 : o.taxYear;
        var y = year(taxYear);
        var x = Math.max(0, Number(income) || 0);
        var idx = 0;
        y.slabs.forEach(function (s, i) { if (x > s[0] || (i === 0 && x >= s[0])) idx = i; });
        var s = y.slabs[idx];
        var base = Math.max(0, s[1] + (x - s[0]) * s[2] / 100);
        var surcharge = y.surcharge && x > y.surcharge.above ? base * y.surcharge.rate / 100 : 0;
        var tax = base + surcharge;
        return { tax: tax, slab: idx, rate: s[2], surcharge: surcharge, effectiveRate: x > 0 ? tax / x * 100 : 0, taxYear: taxYear };
    }

    /** Monthly salary in, monthly figures out (bonus is added to the year's income). */
    function monthly(monthlySalary, options) {
        var o = options || {};
        var income = Math.max(0, Number(monthlySalary) || 0) * 12 + Math.max(0, Number(o.bonus) || 0);
        var r = annualTax(income, o);
        return { annualIncome: income, annualTax: r.tax, monthlyTax: r.tax / 12, monthlyTakeHome: (income - r.tax) / 12,
                 effectiveRate: r.effectiveRate, slab: r.slab, taxYear: r.taxYear };
    }

    function slabs(taxYear) {
        return year(taxYear).slabs.map(function (s, i, all) {
            return { from: s[0], to: all[i + 1] ? all[i + 1][0] : null, fixed: s[1], rate: s[2] };
        });
    }

    return { annualTax: annualTax, monthly: monthly, slabs: slabs, years: Object.keys(YEARS).map(Number), label: function (t) { return year(t).label; } };
});
