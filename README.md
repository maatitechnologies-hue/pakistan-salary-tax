# Pakistan Salary Tax

Income tax on salary in Pakistan for **Tax Year 2027 (1 July 2026 – 30 June 2027)** and **Tax Year 2026**. The slabs are taken from the FBR text of the Income Tax Ordinance, 2001.

- One file with no dependencies; it works in the browser and in Node.
- Monthly or annual salary, with an optional bonus.
- Gives the tax, monthly take-home pay, slab and effective rate.
- Tax Year 2026 includes the 9% surcharge on salaried income above Rs 10 million.

**Use it online:** [mentormakers.pk/tools/pakistan-tax-calculator](https://mentormakers.pk/tools/pakistan-tax-calculator). It is free and has a slab table, a comparison with last year and worked examples.

## Tax Year 2027 slabs (salaried individuals)

| Taxable income per year (Rs) | Tax |
|---|---|
| Up to 600,000 | 0 |
| 600,001 – 1,200,000 | 1% of the amount above 600,000 |
| 1,200,001 – 2,200,000 | 6,000 + 11% above 1,200,000 |
| 2,200,001 – 3,200,000 | 116,000 + 20% above 2,200,000 |
| 3,200,001 – 4,100,000 | 316,000 + 25% above 3,200,000 |
| 4,100,001 – 5,600,000 | 541,000 + 29% above 4,100,000 |
| 5,600,001 – 7,000,000 | 976,000 + 32% above 5,600,000 |
| Above 7,000,000 | 1,424,000 + 35% above 7,000,000 |

From Tax Year 2027 there is no surcharge on income under the head "Salary" (section 4AB, proviso).

## Examples (Tax Year 2027)

| Monthly salary | Monthly tax | Take-home | Effective rate |
|---|---|---|---|
| Rs 100,000 | Rs 500 | Rs 99,500 | 0.50% |
| Rs 200,000 | Rs 13,000 | Rs 187,000 | 6.50% |
| Rs 500,000 | Rs 92,000 | Rs 408,000 | 18.40% |
| Rs 1,000,000 | Rs 264,500 | Rs 735,500 | 26.45% |

## Use the library

**Browser:**

```html
<script src="src/pakistan-salary-tax.js"></script>
<script>
  const r = PakistanSalaryTax.monthly(200000);   // { monthlyTax: 13000, monthlyTakeHome: 187000, ... }
</script>
```

**Node (18+):**

```js
const T = require('./src/pakistan-salary-tax.js');

T.annualTax(2400000);                      // { tax: 156000, slab: 3, rate: 20, surcharge: 0, ... }
T.annualTax(12000000, { taxYear: 2026 });  // includes the 9% surcharge
T.monthly(200000, { bonus: 600000 });      // the bonus is added to the year's income
T.slabs(2027);                             // [{ from, to, fixed, rate }, ...]
```

| Function | Returns |
|---|---|
| `annualTax(income, { taxYear })` | `{ tax, slab, rate, surcharge, effectiveRate, taxYear }` |
| `monthly(salary, { taxYear, bonus })` | `{ annualIncome, annualTax, monthlyTax, monthlyTakeHome, effectiveRate, slab, taxYear }` |
| `slabs(taxYear)` | The slab table |
| `years` | Supported tax years: `[2026, 2027]`. The default is 2027. |

## Source

- [Income Tax Ordinance, 2001](https://download1.fbr.gov.pk/Docs/2026724177725705IncomeTaxOrdinanace2001.pdf): the FBR consolidated text, amended up to 30 June 2026.
- Slabs: First Schedule, Part I, Division I, clause (2), for individuals whose salary is more than 75% of taxable income.
- Surcharge: section 4AB.
- Checked on 19 October 2026.

## Scope

This library is not tax advice. It applies the salaried rates to taxable income. It does not handle:

- exempt allowances;
- tax credits, such as those for Zakat, donations or pension funds;
- withholding adjustments;
- non-salary income.

Check your own case with FBR or a tax adviser.

## Tests

```bash
npm test
```

The expected values in the tests were worked out by hand from the FBR table.

## License

[MIT](LICENSE) © 2026 Maati Tech Private Limited.

## About

Built and maintained by **Maati Tech Private Limited**, Pakistan, for [MentorMakers.pk](https://mentormakers.pk). MentorMakers is a free collection of 250+ online tools, including PDF, image, SEO and Pakistan tools. When the FBR rates change, issues and pull requests that cite the source are welcome.
