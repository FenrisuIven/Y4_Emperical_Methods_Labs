import { randomInt } from "node:crypto"

import { GenerateSequenceParams } from "#types";

export default class Sequence {
  #sequence: number[]      // Розподіл
  #moda: number | number[] // Мода
  #median: number          // Медіана
  #mean: number            // Середнє арифметичне

  #variationDistribution: number[] // Варіаційний розподіл
  #statisticalDistribution: Map<number, number> // Статистичний розподіл

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
    this.#moda = 0
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

  public FormVariationsSeries(): number[] {
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

  public CalculateModa(): number | number[] {
    const maxFreq = Math.max(...this.#statisticalDistribution.values());
    const valuesWithMaxFreq = Map.groupBy(this.#statisticalDistribution, ([, freq]) => freq === maxFreq).get(true)

    if (!valuesWithMaxFreq) {
      this.#moda = 0;
      return 0;
    }
    if (valuesWithMaxFreq.length === 1) {
      this.#moda = valuesWithMaxFreq[0][0];
      return this.#moda;
    }

    let modas = [];

    //TODO: Calc moda for consecutive as a mean of two neighboor values,
    //      and not all of them at once
    const consecutiveValues = valuesWithMaxFreq
      .map(([value, _]) => value)
      .map((value, index, arr) => {
        if (value === arr[index - 1] + 1) return [arr[index - 1], value];
        return null;
      })
      .filter(pair => pair !== null);

    console.log({ valuesWithMaxFreq, consecutiveValues });

    if (consecutiveValues.length === 0) {
      modas = valuesWithMaxFreq.map(([value, _]) => value).sort((a, b) => b - a);
    }
    else {
      modas = consecutiveValues.map(pair => {
        return (pair[0] + pair[1]) / 2
      }).sort((a, b) => b - a);
    }

    // TODO: If values are consecutive, skip both of them later on
    valuesWithMaxFreq.forEach(([value, _]) => {
      if (!modas.includes(value)){
        modas.push(value);
      }
    })
    modas.sort((a, b) => b - a);
    this.#moda = modas
    return this.#moda;

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