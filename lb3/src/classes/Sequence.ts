import { randomInt } from "node:crypto"

import { GenerateSequenceParams } from "#types";

export default class Sequence {
  #sequence: number[]      // Розподіл
  #moda: {                 // Моди
    primary: Array<[number, number]>,
    secondary: Array<[number, number]>
  }
  #median: number          // Медіана
  #mean: number            // Середнє арифметичне

  #variationDistribution: number[] // Варіаційний розподіл
  #statisticalDistribution: Map<number, number> // Статистичний розподіл

  set Sequence(seq: number[]) {
    this.#sequence = seq
  }
  get Sequence() {
    return this.#sequence
  }
  get Moda() {
    return this.#moda
  }
  get Median() {
    return this.#median
  }
  get Mean() {
    return this.#mean
  }

  get VariationDistribution() {
    return this.#variationDistribution
  }
  get StatisticalDistribution() {
    return this.#statisticalDistribution
  }

  constructor() {
    this.#sequence = []
    this.#moda = { primary: [], secondary: [] }
    this.#median = 0
    this.#mean = 0

    this.#variationDistribution = []
    this.#statisticalDistribution = new Map()
  }

  public GenerateRandomSequence({
    sequenceLength,
    possibleVariants,
    minValue,
    maxValue
  }: GenerateSequenceParams): number[] {
    let values: number[] = []

    if (!possibleVariants && minValue && maxValue) {
      values = Array.from({length: maxValue - minValue + 1}, (_, i) => i + minValue)
    } else if (possibleVariants) {
      values = possibleVariants
    } else {
      throw new Error("No possible variants or min/max values were provided");
    }

    const sequence: number[] = Array.from({length: sequenceLength}, () => {
      return values[randomInt(0, values.length)];
    });

    this.#sequence = sequence;
    return sequence;
  }

  public FormVariationsDistribution(): number[] {
    const sorted = [...this.#sequence].sort((a, b) => a - b);
    this.#variationDistribution = sorted;
    return sorted;
  }

  public FormStatisticalDistribution() {
    const distributions = new Map<number, number>();
    this.#variationDistribution.forEach(value => {
      distributions.set(value, (distributions.get(value) ?? 0) + 1);
    });
    this.#statisticalDistribution = distributions
    return distributions;
  }

  public CalculateModa(): {
    primaryModas: Array<[number, number]>,
    secondaryModas: Array<[number, number]>
  } {
    const unsortedDistribution: [number, number][] = []

    let current = 0;
    this.#variationDistribution.forEach((key, index) => {
      const value = this.#statisticalDistribution.get(key);
      if (index === 0) {
        unsortedDistribution.unshift([key - 1, value ?? 0]);
      }
      if (key !== current) {
        current = key;
        if (value){
          unsortedDistribution.push([key, value]);
        }
      }
      if (index === this.#variationDistribution.length - 1) {
        unsortedDistribution.push([key + 1, value ?? 0]);
      }
    })

    const primaryModas: Array<[number, number]> = [];
    const secondaryModas: Array<[number, number]> = [];

    const addModa = (moda: {variant: number, count: number}) => {
      const { variant, count } = moda;

      if (primaryModas.length === 0) {
        primaryModas.push([variant, count]);
        return;
      }

      const primaryModaCount = primaryModas[0][1];

      if (primaryModaCount && count) {
        switch (true) {
          case count > primaryModaCount:
            secondaryModas.push(...primaryModas);
            primaryModas.length = 0;
            primaryModas.push([variant, count]);
            return;
          case count === primaryModaCount:
            primaryModas.push([variant, count]);
            return;
          case count < primaryModaCount:
            secondaryModas.push([variant, count]);
            return;
        }
      }
    }

    let skip = false
    for (let i = 1; i < unsortedDistribution.length - 1; i++) {

      const prev = unsortedDistribution[i - 1];
      const current = unsortedDistribution[i];
      const next = unsortedDistribution[i + 1];

      if (current[1] > prev[1] && current[1] > next[1]) { // Пік
        addModa({ variant: current[0], count: current[1] });
      }
      else if (current[1] === next[1] && current[1] > prev[1]) { // Плато з наступним, та попередній менший
        if (i === unsortedDistribution.length - 2) { // Якщо плато в кінці
          addModa({ variant: current[0], count: current[1] });
        } else {
          addModa({ variant: (current[0] + next[0]) / 2, count: current[1] });
        }
        skip = true; // Якщо на даному елементі вже плато з наступним,
                     // це саме плато буде і на наступному елементі, тож пропускаємо його
      }
      else if (current[1] === prev[1] && current[1] > next[1]) {  // Плато з попереднім, та наступний менший
        if (skip) {     // Пропускаємо лише тут і якщо дійсно досі плато,
          skip = false; // оскільки мода вийде рівною попередній
          continue;
        }
        if (i === 1) { // Якщо плато на початку
          addModa({ variant: current[0], count: current[1] });
        } else {
          addModa({ variant: (current[0] + prev[0]) / 2, count: current[1] });
        }
      }
    }

    this.#moda.primary = primaryModas.sort((a, b) => b[0] - a[0]);
    this.#moda.secondary = secondaryModas.sort((a, b) => b[0] - a[0]);
    return { primaryModas, secondaryModas };
  }

  public CalculateMedian(): number {
    const middle = Math.floor(this.#variationDistribution.length / 2);
    if (this.#variationDistribution.length % 2 === 0) {
      const mid1 = this.#variationDistribution[middle - 1];
      const mid2 = this.#variationDistribution[middle];
      const median = (mid1 + mid2) / 2;
      this.#median = median;
      return median;
    }
    this.#median = this.#variationDistribution[middle];
    return this.#median;
  }

  public CalculateMean() {
    const sum = this.#sequence.reduce((acc, cur) => acc + cur, 0);
    const mean = sum / this.#sequence.length;
    this.#mean = mean;
    return mean;
  }
}