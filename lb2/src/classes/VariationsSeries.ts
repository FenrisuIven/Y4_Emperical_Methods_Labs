import { randomInt } from "node:crypto";

import { Quicksort } from "../functions/quicksort.ts";
import {
  GenerateRandomSequence,
  VariationsAmountsType,
  FrequenciesSeriesType,
  RelativeFrequencySeries,
  FrequentismsSeries
} from "#types"

export class VariationsSeries {
  #sequence: number[]                       // Випадкова послідовність
  #variationsSeries: number[]               // Варіаційний розподіл
  #variationsAmounts: VariationsAmountsType // Статистичний розподіл
  #frequenciesSeries: FrequenciesSeriesType // Частоти елементів
  #frequentismsSeries: FrequentismsSeries   // Частотності та інтегральними частоти

  #amountsControlSuccess: boolean           // Контроль суми варіаційного розподілу
  #frequencyControlSuccess: boolean         // Контроль суми статистичного розподілу

  get sequence() {
    return this.#sequence
  }
  get variationsSeries() {
    return this.#variationsSeries
  }
  get variationsAmounts() {
    return this.#variationsAmounts
  }
  get frequenciesSeries() {
    return this.#frequenciesSeries
  }
  get frequentismsSeries() {
    return this.#frequentismsSeries
  }
  get amountsControlSuccess() {
    return this.#amountsControlSuccess
  }
  get frequencyControlSuccess() {
    return this.#frequencyControlSuccess
  }

  constructor() {
    this.#sequence = [];
    this.#frequenciesSeries = [];
    this.#variationsAmounts = []
    this.#variationsSeries = [];
    this.#frequentismsSeries = [];
    this.#amountsControlSuccess = false;
    this.#frequencyControlSuccess = false;
  }

  // Згенерувати випадкову послідовність
  public FormRandomSequence({ sequenceLength, minValue, maxValue, possibleValues }: GenerateRandomSequence): number[] {
    let values: number[] = [];

    if (possibleValues) {
      possibleValues.forEach(val => values.push(val))
    } else if (minValue && maxValue) {
      values = Array.from({ length: maxValue - minValue + 1 }, (_, idx) => idx + minValue)
    } else {
      throw new Error('No possible values provided');
    }

    const sequence = Array.from({ length: sequenceLength }, () => {
      return values[randomInt(0, values.length)];
    })
    this.#sequence = sequence;
    return sequence;
  }

  // Сформувати варіаційний розподіл
  public GetVariationsSequence() {
    const variationsSeries = Quicksort(this.#sequence);
    this.#variationsSeries = variationsSeries;
    return variationsSeries
  }

  // Сформувати статистичний розподіл
  public FormVariationsAmounts(sort = true):
    { variationsAmounts: VariationsAmountsType, control: number }
  {
    const variationsAmounts: VariationsAmountsType = [];

    this.#sequence.forEach((value) => {
      const found = variationsAmounts.find(v => v.value === value);
      if (found) {
        found.amount += 1;
      } else {
        variationsAmounts.push({ value, amount: 1 });
      }
    })

    const control = variationsAmounts.reduce((acc, cur) => acc + cur.amount, 0);
    this.#amountsControlSuccess = control === this.#sequence.length;

    if (!sort) {
      this.#variationsAmounts = variationsAmounts;
      return { variationsAmounts, control };
    }

    const sorted = variationsAmounts.sort((a, b) => a.value - b.value);
    this.#variationsAmounts = sorted;
    return { variationsAmounts: sorted, control };
  }

  // Визначити частоти елементів
  public FormVariationsFrequenciesSeries(): { series: RelativeFrequencySeries, control: number } {
    if (!this.#amountsControlSuccess) {
      throw new Error('Variations amounts not formed, were formed incorrectly, control failed or something went wrong')
    }
    const varSeries: RelativeFrequencySeries = this.#variationsAmounts.map((variation, idx) => {
      return {
        ...variation,
        relativeFrequency: this.getRelativeFrequency(idx)
      }
    })
    this.#frequenciesSeries = varSeries

    const control = varSeries.reduce((acc, cur) => acc + cur.relativeFrequency, 0);
    this.#frequencyControlSuccess = control == 1;
    return { series: varSeries, control }
  }

  // Формула для розрахунку відносної частоти
  getRelativeFrequency(variationIndex: number) {
    // n*i = ni / n
    return this.#variationsAmounts[variationIndex].amount / this.#sequence.length
  }

  // Визначитии частотності та інтегральні частоти
  public FormFrequentismAndFrequenciesSeries (): FrequentismsSeries{
    const sequenceSize = this.#sequence.length;

    const series: FrequentismsSeries = this.#variationsAmounts.map((variant, index) => {
      const integralFrequency = this.#variationsAmounts
        .slice(0, index + 1)
        .reduce((acc, cur) => acc + cur.amount, 0);

      return {
        ...variant,
        frequentism: variant.amount / sequenceSize,
        integralFrequency: integralFrequency,
      };
    });

    this.#frequentismsSeries = series;
    return series;
  }
}